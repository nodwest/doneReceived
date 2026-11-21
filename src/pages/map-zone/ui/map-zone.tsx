import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { useSessionFamilyId } from '@entities/session';
import {
  createLocationZone,
  updateLocationZone,
  useLocationZones,
  zonesKeys,
  type MapZone,
  type ZonePoint,
} from '@entities/zone';
import { MapAttribution, ZoneMap } from '@widgets/map';
import { TabScreen } from '@widgets/bottom-nav';
import { presenceKeys } from '@features/location';
import { hasApiErrorCode, isApiError } from '@shared/api';
import { showToast } from '@shared/lib';
import { useTranslation } from '@shared/i18n';
import { createStyles, theme, tracking, useTheme } from '@shared/theme';
import {
  GradientButton,
  Input,
  PillButton,
  ScreenHeader,
  Toggle,
} from '@shared/ui';

/** Больше 12 вершин на телефоне рисовать неудобно; сервер разрешает до 64. */
const MAX_ZONE_POINTS = 12;

function zoneBounds(
  points: readonly ZonePoint[],
): [number, number, number, number] | undefined {
  if (points.length === 0) return undefined;
  const latitudes = points.map((point) => point.lat);
  const longitudes = points.map((point) => point.lng);
  return [
    Math.min(...longitudes),
    Math.min(...latitudes),
    Math.max(...longitudes),
    Math.max(...latitudes),
  ];
}

const back = () =>
  router.canGoBack() ? router.back() : router.replace('/map-layers');

/**
 * Геозона: тап по карте ставит вершины, контур виден сразу. Без `zoneId` —
 * создание (`POST`), с `zoneId` — правка существующей (`PATCH`); имя и вершины
 * проверяет сервер, после сохранения список областей обновляется.
 */
export function MapZonePage() {
  useTheme();
  const { t } = useTranslation();
  const cachedFamilyId = useCurrentFamily()?.id;
  const sessionFamilyId = useSessionFamilyId();
  const familyId = cachedFamilyId ?? sessionFamilyId;
  const params = useLocalSearchParams<{ zoneId?: string }>();
  const zoneId = typeof params.zoneId === 'string' ? params.zoneId : null;
  const zones = useLocationZones(zoneId ? familyId : null);
  const zone = zones.data?.find((item) => item.id === zoneId);
  if (zoneId && !zone) {
    const loading = !!familyId && zones.isFetching;
    return (
      <TabScreen activeKey="map">
        <View style={styles.screen}>
          <View style={styles.header}>
            <ScreenHeader title={t('mapZone.editTitle')} onBack={back} />
          </View>
          <View style={styles.formContent}>
            <Text style={styles.hint}>
              {t(loading ? 'common.loading' : 'mapZone.loadError')}
            </Text>
            {!!familyId && !loading && (
              <PillButton
                label={t('common.retry')}
                onPress={() => void zones.refetch()}
              />
            )}
          </View>
        </View>
      </TabScreen>
    );
  }
  return (
    <ZoneEditor
      key={`${familyId}:${zoneId ?? ''}`}
      familyId={familyId}
      zone={zone}
    />
  );
}

function ZoneEditor({
  familyId,
  zone,
}: {
  familyId: string | null;
  zone?: MapZone;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const editing = !!zone;
  const [initialBounds] = useState(() => zoneBounds(zone?.points ?? []));
  const [name, setName] = useState(zone?.name ?? '');
  const [isHome, setIsHome] = useState(zone?.isHome ?? false);
  const [homeEdited, setHomeEdited] = useState(false);
  const [draft, setDraft] = useState<{
    points: ZonePoint[];
    selected: number | null;
  }>({ points: zone?.points ?? [], selected: null });

  const save = useMutation({
    mutationFn: () => {
      if (!familyId) throw new Error('Нет семьи');
      const input = {
        name: name.trim(),
        points: draft.points,
        ...(homeEdited ? { isHome } : {}),
      };
      return zone
        ? updateLocationZone(familyId, zone.id, input)
        : createLocationZone(familyId, input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: zonesKeys.list(familyId),
      });
      void queryClient.invalidateQueries({
        queryKey: presenceKeys.list(familyId),
      });
      showToast(t(editing ? 'mapZone.updatedToast' : 'mapZone.savedToast'));
      back();
    },
    onError: (error) => {
      // Домашняя область уже есть: не уходим с экрана, введённый черновик
      // остаётся на месте — можно выключить переключатель и сохранить снова.
      if (isApiError(error) && hasApiErrorCode(error, 'HOME_ZONE_EXISTS')) {
        showToast(t('mapZone.homeZoneExists'), 'error');
        return;
      }
      showToast(
        t(editing ? 'mapZone.updateError' : 'mapZone.saveError'),
        'error',
      );
    },
  });

  const addPoint = (point: ZonePoint) => {
    if (draft.points.length >= MAX_ZONE_POINTS) {
      showToast(t('mapZone.pointsLimit', { max: MAX_ZONE_POINTS }), 'error');
      return;
    }
    setDraft((current) => {
      // Повторная проверка на случай быстрых тапов до перерисовки.
      if (current.points.length >= MAX_ZONE_POINTS) return current;
      return {
        points: [...current.points, point],
        // Новая вершина сразу выбрана — её можно удалить одной кнопкой.
        selected: current.points.length,
      };
    });
  };

  const selectPoint = (index: number) =>
    setDraft((current) => ({ ...current, selected: index }));

  const movePoint = (index: number, point: ZonePoint) =>
    setDraft((current) => ({
      points: current.points.map((item, itemIndex) =>
        itemIndex === index ? point : item,
      ),
      selected: index,
    }));

  const removePoint = () =>
    setDraft((current) => {
      if (current.selected === null) return current;
      return {
        points: current.points.filter((_, index) => index !== current.selected),
        selected: null,
      };
    });

  const canSave =
    !!familyId &&
    name.trim().length > 0 &&
    draft.points.length >= 3 &&
    !save.isPending;

  return (
    <TabScreen activeKey="map">
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <ScreenHeader
            title={editing ? t('mapZone.editTitle') : t('mapZone.title')}
            onBack={back}
          />
        </View>
        <View style={styles.mapWrap}>
          <ZoneMap
            points={draft.points}
            selectedIndex={draft.selected}
            onAddPoint={addPoint}
            onSelectPoint={selectPoint}
            onMovePoint={movePoint}
            initialBounds={initialBounds}
          />
          <MapAttribution />
        </View>
        <ScrollView
          bounces={false}
          overScrollMode="never"
          style={styles.form}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.hint}>{t('mapZone.hint')}</Text>
          <Text style={styles.points}>
            {t('mapZone.points', {
              value: draft.points.length,
              max: MAX_ZONE_POINTS,
            })}
          </Text>
          <Input
            value={name}
            onChangeText={setName}
            placeholder={t('mapZone.namePlaceholder')}
            placeholderTextColor={theme.colors.placeholder}
            accessibilityLabel={t('mapZone.nameLabel')}
            maxLength={100}
          />
          <View style={styles.homeRow}>
            <View style={styles.homeText}>
              <Text style={styles.homeTitle}>{t('mapZone.homeZone')}</Text>
              <Text style={styles.homeHint}>{t('mapZone.homeZoneHint')}</Text>
            </View>
            <Toggle
              value={isHome}
              onValueChange={(value) => {
                setIsHome(value);
                setHomeEdited(true);
              }}
              accessibilityLabel={t('mapZone.homeZone')}
              tone="blue"
              disabled={save.isPending}
            />
          </View>
          <View style={styles.actions}>
            <PillButton
              label={t('mapZone.removePoint')}
              variant="outline"
              disabled={draft.selected === null || save.isPending}
              onPress={removePoint}
              style={styles.remove}
            />
            <View style={styles.save}>
              <GradientButton
                label={editing ? t('mapZone.saveChanges') : t('mapZone.save')}
                onPress={() => save.mutate()}
                disabled={!canSave}
                loading={save.isPending}
                tone="blue"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TabScreen>
  );
}

const styles = createStyles((colors) => ({
  screen: {
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.prime,
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  mapWrap: {
    flex: 1,
    minHeight: 260,
    marginTop: 4,
    overflow: 'hidden',
    backgroundColor: colors.mapPlaceholder,
  },
  form: {
    flexGrow: 0,
    maxHeight: '48%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  formContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 10,
  },
  hint: {
    fontSize: theme.fontSize.sm,
    lineHeight: 19,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  points: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: colors.mapAccent,
  },
  homeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.prime,
  },
  homeText: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  homeTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  homeHint: {
    fontSize: theme.fontSize.xs,
    lineHeight: 16,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  remove: {
    flex: 1,
  },
  save: {
    flex: 1.4,
  },
}));

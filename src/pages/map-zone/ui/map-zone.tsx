import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import {
  createLocationZone,
  updateLocationZone,
  useLocationZones,
  zonesKeys,
  type ZonePoint,
} from '@entities/zone';
import { MapAttribution, ZoneMap } from '@widgets/map';
import { TabScreen } from '@widgets/bottom-nav';
import { presenceKeys } from '@features/location';
import { showToast } from '@shared/lib';
import { useTranslation } from '@shared/i18n';
import { theme, tracking } from '@shared/theme';
import { GradientButton, Input, PillButton, ScreenHeader } from '@shared/ui';

/** Больше 12 вершин на телефоне рисовать неудобно; сервер разрешает до 64. */
const MAX_ZONE_POINTS = 12;

/** Центр контура — среднее вершин: туда наводим карту при правке. */
function zoneCenter(points: readonly ZonePoint[]): ZonePoint | undefined {
  if (points.length === 0) return undefined;
  let lat = 0;
  let lng = 0;
  for (const point of points) {
    lat += point.lat;
    lng += point.lng;
  }
  return { lat: lat / points.length, lng: lng / points.length };
}

/**
 * Геозона: тап по карте ставит вершины, контур виден сразу. Без `zoneId` —
 * создание (`POST`), с `zoneId` — правка существующей (`PATCH`); имя и вершины
 * проверяет сервер, после сохранения список областей обновляется.
 */
export function MapZonePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;
  const params = useLocalSearchParams<{ zoneId?: string }>();
  const zoneId = typeof params.zoneId === 'string' ? params.zoneId : null;
  const editing = !!zoneId;

  const { data: zones = [] } = useLocationZones(familyId);
  const zone = zoneId
    ? (zones.find((item) => item.id === zoneId) ?? null)
    : null;

  const [name, setName] = useState('');
  const [draft, setDraft] = useState<{
    points: ZonePoint[];
    selected: number | null;
  }>({ points: [], selected: null });
  const filled = useRef(false);
  // Правка: заполняем форму, когда зона пришла (обычно уже из кэша списка).
  useEffect(() => {
    if (!zone || filled.current) return;
    filled.current = true;
    setName(zone.name);
    setDraft({ points: zone.points, selected: null });
  }, [zone]);

  const back = () =>
    router.canGoBack() ? router.back() : router.replace('/map-layers');

  const save = useMutation({
    mutationFn: () => {
      if (!familyId) throw new Error('Нет семьи');
      const input = { name: name.trim(), points: draft.points };
      return editing && zoneId
        ? updateLocationZone(familyId, zoneId, input)
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
    onError: () =>
      showToast(t(editing ? 'mapZone.updateError' : 'mapZone.saveError')),
  });

  const addPoint = (point: ZonePoint) => {
    if (draft.points.length >= MAX_ZONE_POINTS) {
      showToast(t('mapZone.pointsLimit', { max: MAX_ZONE_POINTS }));
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
    (!editing || !!zone) &&
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
            center={editing && zone ? zoneCenter(zone.points) : undefined}
          />
          <MapAttribution />
        </View>
        <ScrollView
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    backgroundColor: theme.colors.prime,
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
    backgroundColor: theme.colors.mapPlaceholder,
  },
  form: {
    flexGrow: 0,
    maxHeight: '48%',
    backgroundColor: theme.colors.white,
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
    color: theme.colors.grey,
  },
  points: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.mapAccent,
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
});

import { useCallback, useRef, useState, type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily, useFamilyChildren } from '@entities/family';
import { useSessionKind } from '@entities/session';
import type { Bus } from '@entities/vehicle';
import {
  deleteLocationZone,
  useLocationZones,
  zonesKeys,
  type MapZone,
} from '@entities/zone';
import { busRouteKey, useBusesSocket } from '@features/buses';
import { useLocationSocket } from '@features/location';
import { TabScreen } from '@widgets/bottom-nav';
import {
  useMapLayerStore,
  type HiddenLayerKey,
  type MapLayerKey,
} from '@widgets/map';
import { authorizedImage } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import {
  BottomSheet,
  GradientButton,
  Icon,
  LetterAvatar,
  PillButton,
  RoundButton,
  ScreenHeader,
  type IconName,
} from '@shared/ui';
import { styles } from './map-layers.styled';

/** Маршрут из живого потока: список маршрутов сервер отдельно не отдаёт. */
type RouteOption = {
  route: string;
};

/** Новые маршруты добавляем, исчезнувшие оставляем в списке. */
function collectRoutes(prev: RouteOption[], vehicles: readonly Bus[]) {
  const known = new Set(prev.map((item) => item.route));
  const next = prev.slice();
  for (const vehicle of vehicles) {
    const key = busRouteKey(vehicle);
    if (known.has(key)) continue;
    known.add(key);
    next.push({ route: vehicle.route });
  }
  if (next.length === prev.length) return prev;
  return next.sort((a, b) =>
    a.route.localeCompare(b.route, undefined, { numeric: true }),
  );
}

function sortRoutes(routes: readonly string[]) {
  return routes
    .slice()
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

type CheckRowProps = {
  title: string;
  subtitle?: string;
  checked: boolean;
  onPress: () => void;
  icon?: IconName;
  avatar?: { name: string; source: ImageSourcePropType | null };
  /** Кнопки действий (правка/удаление) перед галочкой. */
  actions?: ReactNode;
  last?: boolean;
};

/** Строка слоя с галочкой: аватар ребёнка или иконка категории. */
function CheckRow({
  title,
  subtitle,
  checked,
  onPress,
  icon,
  avatar,
  actions,
  last,
}: CheckRowProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      accessibilityState={{ checked }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !last && styles.rowDivider,
        pressed && styles.pressed,
      ]}
    >
      {avatar ? (
        <LetterAvatar
          source={avatar.source}
          name={avatar.name}
          style={styles.avatar}
          letterSize={17}
        />
      ) : (
        <View style={styles.rowIcon}>
          <Icon name={icon ?? 'layers'} size={22} color={theme.colors.violet} />
        </View>
      )}
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actions ? <View style={styles.rowActions}>{actions}</View> : null}
      <View style={[styles.checkbox, !checked && styles.checkboxOff]}>
        {checked && <Icon name="check" size={18} color={theme.colors.white} />}
      </View>
    </Pressable>
  );
}

type IconButtonProps = {
  icon: IconName;
  label: string;
  tone: 'violet' | 'danger';
  onPress: () => void;
};

/** Маленькая круглая кнопка действия в строке: правка или удаление. */
function IconButton({ icon, label, tone, onPress }: IconButtonProps) {
  const danger = tone === 'danger';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={(event) => {
        // Тап по действию не должен заодно переключать слой.
        event.stopPropagation();
        onPress();
      }}
      style={({ pressed }) => [
        styles.action,
        danger ? styles.actionDanger : styles.actionEdit,
        pressed && styles.pressed,
      ]}
    >
      <Icon
        name={icon}
        size={17}
        color={danger ? theme.colors.dangerText : theme.colors.violet}
      />
    </Pressable>
  );
}

function AddRow({
  label,
  onPress,
  hidden,
}: {
  label: string;
  onPress: () => void;
  hidden?: boolean;
}) {
  if (hidden) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.add, pressed && styles.pressed]}
    >
      <Icon name="plus" size={18} color={theme.colors.violet} />
      <Text style={styles.addText}>{label}</Text>
    </Pressable>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Icon name={icon} size={20} color={theme.colors.violet} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <Text style={styles.empty}>{text}</Text>;
}

/**
 * «Слои карты» — что показывать на вкладке Map: детей, маршруты транспорта и
 * геозоны. Выбор хранится на устройстве (`useMapLayerStore`), карта читает
 * его при отрисовке. Маршруты добавляются из живого потока: REST-списка
 * маршрутов на сервере нет.
 */
export function MapLayersPage() {
  const { t } = useTranslation();
  const { height: windowHeight } = useWindowDimensions();
  const kind = useSessionKind();
  const familyId = useCurrentFamily()?.id ?? null;

  const childrenQuery = useFamilyChildren(kind === 'parent' ? familyId : null);
  const children = childrenQuery.data ?? [];
  const zonesQuery = useLocationZones(familyId);
  const zones = zonesQuery.data ?? [];

  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  useBusesSocket(
    useCallback((vehicles: Bus[]) => {
      setRoutes((prev) => collectRoutes(prev, vehicles));
    }, []),
  );

  // Последняя известная зона каждого ребёнка: подпись «Сейчас в области» /
  // «Сейчас вне области» в списке областей. Перерисовываем только когда
  // ребёнок перешёл из зоны в зону, а не на каждую координату.
  const zoneByChild = useRef(new Map<string, string | null>());
  const [occupiedZones, setOccupiedZones] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  useLocationSocket(
    useCallback((location) => {
      const id = location.childId ?? location.userId;
      const zoneId = location.zoneId ?? null;
      if (zoneByChild.current.get(id) === zoneId) return;
      zoneByChild.current.set(id, zoneId);
      setOccupiedZones(
        new Set(
          [...zoneByChild.current.values()].filter(
            (value): value is string => !!value,
          ),
        ),
      );
    }, []),
  );

  const family = useMapLayerStore((state) => state.family);
  const transport = useMapLayerStore((state) => state.transport);
  const areas = useMapLayerStore((state) => state.areas);
  const hiddenChildren = useMapLayerStore((state) => state.hiddenChildren);
  const hiddenRoutes = useMapLayerStore((state) => state.hiddenRoutes);
  const hiddenZones = useMapLayerStore((state) => state.hiddenZones);
  const pinnedRoutes = useMapLayerStore((state) => state.pinnedRoutes);
  const setLayer = useMapLayerStore((state) => state.setLayer);
  const setHidden = useMapLayerStore((state) => state.setHidden);
  const setPinnedRoutes = useMapLayerStore((state) => state.setPinnedRoutes);
  const showAll = useMapLayerStore((state) => state.showAll);

  const queryClient = useQueryClient();
  const [zoneToDelete, setZoneToDelete] = useState<MapZone | null>(null);
  const removeZone = useMutation({
    mutationFn: (zone: MapZone) => deleteLocationZone(familyId!, zone.id),
    onSuccess: (_data, zone) => {
      void queryClient.invalidateQueries({
        queryKey: zonesKeys.list(familyId),
      });
      setHidden(
        'zones',
        hiddenZones.filter((id) => id !== zone.id),
      );
      setZoneToDelete(null);
      showToast(t('mapLayers.zoneDeleted'));
    },
    onError: () => showToast(t('mapLayers.zoneDeleteError')),
  });

  const editZone = (id: string) =>
    router.push({ pathname: '/map-zone', params: { zoneId: id } });

  // Слой был выключен целиком: включаем и показываем только выбранный пункт.
  const toggleItem = (
    layerKey: MapLayerKey,
    hiddenKey: HiddenLayerKey,
    enabled: boolean,
    hidden: readonly string[],
    allIds: readonly string[],
    id: string,
  ) => {
    if (!enabled) {
      setHidden(
        hiddenKey,
        allIds.filter((item) => item !== id),
      );
      setLayer(layerKey, true);
      return;
    }
    setHidden(
      hiddenKey,
      hidden.includes(id)
        ? hidden.filter((item) => item !== id)
        : [...hidden, id],
    );
  };

  const togglePinnedRoute = (route: string) => {
    if (pinnedRoutes.includes(route)) {
      setPinnedRoutes(pinnedRoutes.filter((item) => item !== route));
      setHidden(
        'routes',
        hiddenRoutes.filter((item) => item !== route),
      );
      return;
    }

    const next = [...pinnedRoutes, route];
    setPinnedRoutes(next);
    // Добавляем маршрут, чтобы увидеть его: включаем слой, а при выключенном
    // слое оставляем видимым только новый маршрут.
    if (!transport) {
      setLayer('transport', true);
      setHidden(
        'routes',
        next.filter((item) => item !== route),
      );
      return;
    }
    setHidden(
      'routes',
      hiddenRoutes.filter((item) => item !== route),
    );
  };

  const back = () =>
    router.canGoBack() ? router.back() : router.replace('/map');

  const childIds = children.map((child) => child.id);
  const zoneIds = zones.map((zone) => zone.id);
  const pinned = sortRoutes(pinnedRoutes);
  // В шторке — и выбранные, и те, что сейчас на линии.
  const pickerRoutes = sortRoutes(
    Array.from(new Set([...pinnedRoutes, ...routes.map((item) => item.route)])),
  );

  const parent = kind === 'parent';

  return (
    <TabScreen activeKey="map">
      <View style={styles.screen}>
        <View style={styles.header}>
          <ScreenHeader
            title={t('mapLayers.title')}
            onBack={back}
            right={
              <RoundButton
                icon="list"
                accessibilityLabel={t('mapLayers.showAll')}
                onPress={showAll}
              />
            }
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {parent && (
            <Section icon="children" title={t('mapLayers.family')}>
              {children.map((child, index) => (
                <CheckRow
                  key={child.id}
                  title={child.displayName}
                  subtitle={t('mapLayers.childRole')}
                  avatar={{
                    name: child.displayName,
                    source: child.avatarUrl
                      ? authorizedImage(child.avatarUrl)
                      : null,
                  }}
                  checked={family && !hiddenChildren.includes(child.id)}
                  onPress={() =>
                    toggleItem(
                      'family',
                      'children',
                      family,
                      hiddenChildren,
                      childIds,
                      child.id,
                    )
                  }
                  last={index === children.length - 1}
                />
              ))}
              {children.length === 0 && !childrenQuery.isPending && (
                <EmptyRow text={t('mapLayers.emptyChildren')} />
              )}
            </Section>
          )}

          <Section icon="bus" title={t('mapLayers.transportSection')}>
            {pinned.map((route, index) => (
              <CheckRow
                key={route}
                title={t('mapLayers.routeTitle', { route })}
                icon="bus"
                checked={transport && !hiddenRoutes.includes(route)}
                onPress={() =>
                  toggleItem(
                    'transport',
                    'routes',
                    transport,
                    hiddenRoutes,
                    pinned,
                    route,
                  )
                }
                last={index === pinned.length - 1}
              />
            ))}
            {pinned.length === 0 && (
              <EmptyRow text={t('mapLayers.emptyRoutes')} />
            )}
            <AddRow
              label={t('mapLayers.addTransport')}
              onPress={() => setPickerOpen(true)}
            />
          </Section>

          <Section icon="zone" title={t('mapLayers.areas')}>
            {zones.map((zone, index) => (
              <CheckRow
                key={zone.id}
                title={zone.name}
                subtitle={
                  occupiedZones.has(zone.id)
                    ? t('mapLayers.zoneInside')
                    : t('mapLayers.zoneOutside')
                }
                icon="zone"
                actions={
                  parent ? (
                    <>
                      <IconButton
                        icon="pencil"
                        tone="violet"
                        label={t('mapLayers.editZone', { name: zone.name })}
                        onPress={() => editZone(zone.id)}
                      />
                      <IconButton
                        icon="trash"
                        tone="danger"
                        label={t('mapLayers.deleteZone', { name: zone.name })}
                        onPress={() => setZoneToDelete(zone)}
                      />
                    </>
                  ) : undefined
                }
                checked={areas && !hiddenZones.includes(zone.id)}
                onPress={() =>
                  toggleItem(
                    'areas',
                    'zones',
                    areas,
                    hiddenZones,
                    zoneIds,
                    zone.id,
                  )
                }
                last={index === zones.length - 1}
              />
            ))}
            {zones.length === 0 && !zonesQuery.isPending && (
              <EmptyRow text={t('mapLayers.emptyAreas')} />
            )}
            <AddRow
              label={t('mapLayers.addArea')}
              onPress={() => router.push('/map-zone')}
              hidden={!parent}
            />
          </Section>
        </ScrollView>
      </View>

      <BottomSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        maxHeightRatio={0.7}
      >
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{t('mapLayers.addTransport')}</Text>
          <ScrollView
            style={[
              styles.sheetList,
              { maxHeight: Math.max(140, windowHeight * 0.7 - 180) },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {pickerRoutes.map((route) => (
              <CheckRow
                key={route}
                title={t('mapLayers.routeTitle', { route })}
                icon="bus"
                checked={pinnedRoutes.includes(route)}
                onPress={() => togglePinnedRoute(route)}
                last={route === pickerRoutes[pickerRoutes.length - 1]}
              />
            ))}
            {pickerRoutes.length === 0 && (
              <EmptyRow text={t('mapLayers.emptyTransport')} />
            )}
          </ScrollView>
          <GradientButton
            label={t('common.done')}
            onPress={() => setPickerOpen(false)}
          />
        </View>
      </BottomSheet>

      <BottomSheet
        visible={!!zoneToDelete}
        onClose={() => setZoneToDelete(null)}
      >
        <View style={styles.confirmBody}>
          <View style={styles.confirmIcon}>
            <Icon name="trash" size={24} color={theme.colors.dangerText} />
          </View>
          <View style={styles.confirmHeader}>
            <Text style={styles.confirmTitle}>
              {t('mapLayers.deleteZoneTitle')}
            </Text>
            <Text style={styles.confirmSubtitle}>
              {t('mapLayers.deleteZoneSubtitle', {
                name: zoneToDelete?.name ?? '',
              })}
            </Text>
          </View>
          <View style={styles.confirmActions}>
            <PillButton
              label={t('common.cancel')}
              variant="ghost"
              disabled={removeZone.isPending}
              onPress={() => setZoneToDelete(null)}
            />
            <PillButton
              label={t('mapLayers.deleteZoneConfirm')}
              variant="danger"
              disabled={removeZone.isPending}
              onPress={() => {
                if (zoneToDelete) removeZone.mutate(zoneToDelete);
              }}
            />
          </View>
        </View>
      </BottomSheet>
    </TabScreen>
  );
}

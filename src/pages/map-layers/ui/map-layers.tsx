import { useCallback, useState, type ReactNode } from 'react';
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
import { useCurrentFamily, useFamilyMembers } from '@entities/family';
import type { FamilyMember } from '@entities/family';
import { useMyId, useSessionFamilyId, useSessionKind } from '@entities/session';
import type { Bus } from '@entities/vehicle';
import {
  deleteLocationZone,
  useLocationZones,
  zonesKeys,
  type MapZone,
} from '@entities/zone';
import { busRouteKey, useBusesSocket } from '@features/buses';
import {
  presenceKeys,
  useLocationPresence,
  type LocationPresence,
} from '@features/location';
import { TabScreen } from '@widgets/bottom-nav';
import {
  useMapLayerStore,
  type HiddenLayerKey,
  type MapLayerKey,
} from '@widgets/map';
import { authorizedImage } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast, formatTimeAgo, useNow } from '@shared/lib';
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
import { MemberMapSettingsSheet } from './member-map-settings-sheet';

/** Маршрут из живого потока: список маршрутов сервер отдельно не отдаёт. */
type RouteOption = {
  route: string;
};

/** В раскрытом разделе видно не больше пяти строк, дальше — внутренний скролл. */
const SECTION_VISIBLE_ROWS = 5;
const SECTION_ROW_HEIGHT = 64;
const SECTION_LIST_MAX_HEIGHT = SECTION_VISIBLE_ROWS * SECTION_ROW_HEIGHT;

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
  subtitle?: ReactNode;
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
      accessibilityHint={typeof subtitle === 'string' ? subtitle : undefined}
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
          typeof subtitle === 'string' ? (
            <Text style={styles.rowSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : (
            subtitle
          )
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
  expanded,
  onToggle,
  children,
}: {
  icon: IconName;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded }}
        aria-expanded={expanded}
        onPress={onToggle}
        style={({ pressed }) => [styles.cardHeader, pressed && styles.pressed]}
      >
        <View style={styles.cardIcon}>
          <Icon name={icon} size={20} color={theme.colors.violet} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </Pressable>
      {expanded ? children : null}
    </View>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <Text style={styles.empty}>{text}</Text>;
}

type ZoneStatus = {
  state: 'inside' | 'outside' | null;
  /** Время последнего события; null — координат ещё не было. */
  updatedAt: string | null;
};

/** Пять минут — ещё «сейчас», дальше показываем возраст события. */
const ZONE_FRESH_MS = 5 * 60_000;
/** Час без координат — уже «нет данных», а не «в школе вчера». */
const ZONE_STALE_MS = 60 * 60_000;
const EPOCH_ISO = new Date(0).toISOString();

function laterTimestamp(a: string | null, b: string | null) {
  if (!a) return b;
  if (!b) return a;
  return Date.parse(b) > Date.parse(a) ? b : a;
}

/**
 * Собрать статус зоны по всем детям: если хотя бы один подтверждённо внутри,
 * зона считается занятой; иначе — последнее подтверждённое «снаружи».
 */
function buildZoneStatuses(presence: LocationPresence | undefined) {
  const inside = new Map<string, string | null>();
  const outside = new Map<string, string | null>();
  let latest: string | null = null;

  for (const child of presence?.children ?? []) {
    latest = laterTimestamp(latest, child.updatedAt);
    if (!child.updatedAt) continue;
    for (const zone of child.zones) {
      const map = zone.state === 'inside' ? inside : outside;
      map.set(
        zone.zoneId,
        laterTimestamp(map.get(zone.zoneId) ?? null, child.updatedAt),
      );
    }
  }

  return (zoneId: string): ZoneStatus => {
    if (inside.has(zoneId)) {
      return {
        state: 'inside',
        updatedAt: inside.get(zoneId) ?? latest,
      };
    }
    if (outside.has(zoneId)) {
      return {
        state: 'outside',
        updatedAt: outside.get(zoneId) ?? latest,
      };
    }
    return { state: null, updatedAt: latest };
  };
}

function ZoneStatusText({
  name,
  status,
  now,
}: {
  name: string;
  status: ZoneStatus;
  now: Date;
}) {
  const { t } = useTranslation();
  const ago = formatTimeAgo(new Date(status.updatedAt ?? EPOCH_ISO), now);
  const age = status.updatedAt
    ? now.getTime() - Date.parse(status.updatedAt)
    : Infinity;
  const fresh = age <= ZONE_FRESH_MS;
  const unknown = !status.state || age > ZONE_STALE_MS;

  if (unknown) {
    return (
      <Text style={styles.rowSubtitle} numberOfLines={1}>
        {status.updatedAt
          ? t('mapLayers.zoneNoDataAgo', { ago })
          : t('mapLayers.zoneNoData')}
      </Text>
    );
  }

  if (status.state === 'inside') {
    return (
      <Text style={styles.rowSubtitle} numberOfLines={1}>
        {fresh
          ? t('mapLayers.zoneInside')
          : t('mapLayers.zoneInsideAgo', { name, ago })}
      </Text>
    );
  }

  return (
    <Text style={styles.rowSubtitle} numberOfLines={1}>
      {fresh
        ? t('mapLayers.zoneOutside')
        : t('mapLayers.zoneOutsideAgo', { ago })}
    </Text>
  );
}

/** Список строк раздела: максимум пять, остальное — скроллом. */
function SectionList({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      style={[styles.sectionList, { maxHeight: SECTION_LIST_MAX_HEIGHT }]}
      nestedScrollEnabled
      showsVerticalScrollIndicator
    >
      {children}
    </ScrollView>
  );
}

/**
 * «Слои карты» — что показывать на вкладке Map: членов семьи, маршруты
 * транспорта и геозоны. Выбор хранится на устройстве (`useMapLayerStore`),
 * карта читает его при отрисовке. Маршруты добавляются из живого потока:
 * REST-списка маршрутов на сервере нет.
 */
export function MapLayersPage() {
  const { t } = useTranslation();
  const { height: windowHeight } = useWindowDimensions();
  const now = useNow(60_000);
  const myId = useMyId();
  const kind = useSessionKind();
  const cachedFamilyId = useCurrentFamily()?.id ?? null;
  const sessionFamilyId = useSessionFamilyId();
  const familyId = cachedFamilyId ?? sessionFamilyId;

  const membersQuery = useFamilyMembers(familyId);
  const members = membersQuery.data ?? [];
  const zonesQuery = useLocationZones(familyId);
  const zones = zonesQuery.data ?? [];

  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  useBusesSocket(
    useCallback((vehicles: Bus[]) => {
      setRoutes((prev) => collectRoutes(prev, vehicles));
    }, []),
  );

  // Подтверждённые состояния зон: последние с сервера + live-события общего
  // сокета приложения. «Нет данных» — это отсутствие состояния, а не «вне
  // области».
  const queryClient = useQueryClient();
  const { data: presence } = useLocationPresence(familyId);

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
  const openSections = useMapLayerStore((state) => state.openSections);
  const toggleSection = useMapLayerStore((state) => state.toggleSection);
  const showAll = useMapLayerStore((state) => state.showAll);
  const [settingsTarget, setSettingsTarget] = useState<FamilyMember | null>(
    null,
  );

  const [zoneToDelete, setZoneToDelete] = useState<MapZone | null>(null);
  const removeZone = useMutation({
    mutationFn: (zone: MapZone) => deleteLocationZone(familyId!, zone.id),
    onSuccess: (_data, zone) => {
      void queryClient.invalidateQueries({
        queryKey: zonesKeys.list(familyId),
      });
      void queryClient.invalidateQueries({
        queryKey: presenceKeys.list(familyId),
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

  const memberIds = members.map((member) => member.userId);
  const zoneIds = zones.map((zone) => zone.id);
  const zoneStatusFor = buildZoneStatuses(presence);
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
          <Section
            icon="children"
            title={t('mapLayers.family')}
            expanded={openSections.family}
            onToggle={() => toggleSection('family')}
          >
            <SectionList>
              {members.map((member, index) => (
                <CheckRow
                  key={member.userId}
                  title={member.displayName}
                  subtitle={
                    member.userId === myId
                      ? member.kind === 'child'
                        ? t('mapLayers.youChildRole')
                        : t('mapLayers.youRole')
                      : member.kind === 'child'
                        ? t('mapLayers.childRole')
                        : t('mapLayers.parentRole')
                  }
                  avatar={{
                    name: member.displayName,
                    source: member.avatarUrl
                      ? authorizedImage(member.avatarUrl)
                      : null,
                  }}
                  checked={family && !hiddenChildren.includes(member.userId)}
                  actions={
                    parent &&
                    (member.kind === 'child' || member.userId === myId) ? (
                      <IconButton
                        icon="pencil"
                        tone="violet"
                        label={t('mapLayers.memberSettings', {
                          name: member.displayName,
                        })}
                        onPress={() => setSettingsTarget(member)}
                      />
                    ) : undefined
                  }
                  onPress={() =>
                    toggleItem(
                      'family',
                      'children',
                      family,
                      hiddenChildren,
                      memberIds,
                      member.userId,
                    )
                  }
                  last={index === members.length - 1}
                />
              ))}
              {members.length === 0 && !membersQuery.isPending && (
                <EmptyRow text={t('mapLayers.emptyChildren')} />
              )}
            </SectionList>
          </Section>

          <Section
            icon="bus"
            title={t('mapLayers.transportSection')}
            expanded={openSections.transport}
            onToggle={() => toggleSection('transport')}
          >
            <SectionList>
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
            </SectionList>
            <AddRow
              label={t('mapLayers.addTransport')}
              onPress={() => setPickerOpen(true)}
            />
          </Section>

          <Section
            icon="zone"
            title={t('mapLayers.areas')}
            expanded={openSections.areas}
            onToggle={() => toggleSection('areas')}
          >
            <SectionList>
              {zones.map((zone, index) => (
                <CheckRow
                  key={zone.id}
                  title={zone.name}
                  subtitle={
                    <ZoneStatusText
                      name={zone.name}
                      status={zoneStatusFor(zone.id)}
                      now={now}
                    />
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
            </SectionList>
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
      {familyId ? (
        <MemberMapSettingsSheet
          familyId={familyId}
          member={settingsTarget}
          onClose={() => setSettingsTarget(null)}
        />
      ) : null}
    </TabScreen>
  );
}

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
import { formatClock, formatTimeAgo, showToast, useNow } from '@shared/lib';
import { theme } from '@shared/theme';
import {
  BottomSheet,
  GradientButton,
  Icon,
  LetterAvatar,
  PillButton,
  RoundButton,
  ScreenHeader,
  SwipeableRow,
  Toggle,
  type IconName,
} from '@shared/ui';
import {
  styles,
  SWIPE_ACTION_GAP,
  swipeActionsWidth,
} from './map-layers.styled';

/** Маршрут из живого потока: список маршрутов сервер отдельно не отдаёт. */
type RouteOption = {
  route: string;
};

/** В раскрытом разделе видно не больше пяти строк, дальше — внутренний скролл. */
const SECTION_VISIBLE_ROWS = 5;
const SECTION_ROW_HEIGHT = 66;
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

type LayerRowProps = {
  title: string;
  subtitle?: ReactNode;
  checked: boolean;
  onPress: () => void;
  icon?: IconName;
  /** Плитка автобуса — жёлтая, остальные — голубые. */
  iconTone?: 'blue' | 'bus';
  avatar?: { name: string; source: ImageSourcePropType | null };
  /** Перед переключателем: кто внутри области, кнопка настроек. */
  aside?: ReactNode;
  /** Зелёная полоса слева: в области кто-то есть. */
  accent?: boolean;
  /** Строки областей чуть выше и с полосой слева. */
  tall?: boolean;
};

/** Строка слоя: аватар или иконка, подписи и переключатель. */
function LayerRow({
  title,
  subtitle,
  checked,
  onPress,
  icon,
  iconTone = 'blue',
  avatar,
  aside,
  accent,
  tall,
}: LayerRowProps) {
  const bus = iconTone === 'bus';
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={title}
      accessibilityHint={typeof subtitle === 'string' ? subtitle : undefined}
      accessibilityState={{ checked }}
      onPress={onPress}
      style={({ pressed }) => [styles.rowWrap, pressed && styles.pressed]}
    >
      {tall ? (
        <View style={styles.accentWrap}>
          <View style={[styles.accent, accent && styles.accentOn]} />
        </View>
      ) : null}
      <View style={[styles.row, tall && styles.rowTall]}>
        {avatar ? (
          <LetterAvatar
            source={avatar.source}
            name={avatar.name}
            style={styles.avatar}
            letterSize={16}
          />
        ) : (
          <View style={[styles.rowIcon, bus && styles.rowIconBus]}>
            <Icon
              name={icon ?? 'layers'}
              size={20}
              color={bus ? theme.colors.busIcon : theme.colors.mapAccent}
            />
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
        {aside ? <View style={styles.rowAside}>{aside}</View> : null}
        {/* Переключатель только показывает состояние: нажимается вся строка. */}
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Toggle value={checked} onValueChange={() => {}} tone="blue" />
        </View>
      </View>
    </Pressable>
  );
}

/** Кнопка под смахнутой строкой: Edit (голубая) или Delete (красная). */
function SwipeAction({
  icon,
  label,
  accessibilityLabel,
  tone,
  onPress,
}: {
  icon: IconName;
  label: string;
  accessibilityLabel: string;
  tone: 'edit' | 'delete';
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.swipeAction,
        tone === 'edit' ? styles.swipeEdit : styles.swipeDelete,
        pressed && styles.pressed,
      ]}
    >
      <Icon name={icon} size={18} color={theme.colors.white} />
      <Text style={styles.swipeLabel}>{label}</Text>
    </Pressable>
  );
}

/** Черта между строками: у участников и маршрутов — от текста. */
function Divider({ inset }: { inset?: boolean }) {
  return <View style={[styles.divider, inset && styles.dividerInset]} />;
}

/** Пунктирная кнопка «Добавить…» внизу карточки. */
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
    <View style={styles.addWrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [styles.add, pressed && styles.pressed]}
      >
        <Icon name="plus" size={18} color={theme.colors.mapAccent} />
        <Text style={styles.addText}>{label}</Text>
      </Pressable>
    </View>
  );
}

/**
 * Карточка раздела: заголовок капсом и счётчик справа. Тап по заголовку
 * сворачивает раздел.
 */
function Section({
  title,
  count,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  count?: string;
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
        <Text style={styles.cardTitle} numberOfLines={1}>
          {title}
        </Text>
        {count ? <Text style={styles.cardCount}>{count}</Text> : null}
      </Pressable>
      {expanded ? children : null}
    </View>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <Text style={styles.empty}>{text}</Text>;
}

/** Час без координат — уже «нет данных», а не «в школе вчера». */
const ZONE_STALE_MS = 60 * 60_000;

type ZoneInside = { childId: string; since: string };

type ZoneStatus = {
  /** Кто подтверждённо внутри, последний пришедший — первым. */
  inside: ZoneInside[];
  /** Когда последний ребёнок вышел; null — выходов не было. */
  leftAt: string | null;
  /** Последнее событие геолокации; null — координат ещё не было. */
  updatedAt: string | null;
};

function laterTimestamp(a: string | null, b: string | null) {
  if (!a) return b;
  if (!b) return a;
  return Date.parse(b) > Date.parse(a) ? b : a;
}

/**
 * Статусы зон по детям. Ребёнок, от которого больше часа нет координат,
 * в зонах не учитывается: его последнее «внутри» могло давно устареть.
 * `onlyChildId` — экран ребёнка: только его собственные состояния.
 */
function buildZoneStatuses(
  presence: LocationPresence | undefined,
  now: Date,
  onlyChildId: string | null,
) {
  const inside = new Map<string, ZoneInside[]>();
  const leftAt = new Map<string, string | null>();
  let latest: string | null = null;

  for (const child of presence?.children ?? []) {
    if (onlyChildId && child.childId !== onlyChildId) continue;
    latest = laterTimestamp(latest, child.updatedAt);
    if (!child.updatedAt) continue;
    if (now.getTime() - Date.parse(child.updatedAt) > ZONE_STALE_MS) continue;
    for (const zone of child.zones) {
      if (zone.state === 'inside') {
        const list = inside.get(zone.zoneId) ?? [];
        list.push({ childId: child.childId, since: zone.since });
        inside.set(zone.zoneId, list);
      } else {
        leftAt.set(
          zone.zoneId,
          laterTimestamp(leftAt.get(zone.zoneId) ?? null, zone.since),
        );
      }
    }
  }

  return (zoneId: string): ZoneStatus => ({
    inside: (inside.get(zoneId) ?? [])
      .slice()
      .sort((a, b) => Date.parse(b.since) - Date.parse(a.since)),
    leftAt: leftAt.get(zoneId) ?? null,
    updatedAt: latest,
  });
}

/** Подпись области: кто внутри, когда вышли или что данных нет. */
function ZoneStatusText({
  status,
  now,
  self,
  nameOf,
  selfAvatar,
}: {
  status: ZoneStatus;
  now: Date;
  /** Экран ребёнка: «Ты сейчас здесь» вместо имён. */
  self: boolean;
  nameOf: (childId: string) => string;
  selfAvatar?: { name: string; source: ImageSourcePropType | null };
}) {
  const { t } = useTranslation();
  const ago = (iso: string) => formatTimeAgo(new Date(iso), now);

  if (status.inside.length > 0) {
    if (self) {
      return (
        <View style={styles.statusLine}>
          {selfAvatar ? (
            <LetterAvatar
              source={selfAvatar.source}
              name={selfAvatar.name}
              style={styles.statusAvatar}
              letterSize={9}
            />
          ) : null}
          <Text style={styles.statusInside} numberOfLines={1}>
            {t('mapLayers.zoneYouHere')}
          </Text>
        </View>
      );
    }
    const [first] = status.inside;
    return (
      <Text style={styles.statusInside} numberOfLines={1}>
        {t('mapLayers.zoneArrived', {
          name: status.inside.map((item) => nameOf(item.childId)).join(', '),
          time: formatClock(new Date(first.since)),
        })}
      </Text>
    );
  }

  if (status.leftAt) {
    const text = self
      ? t('mapLayers.zoneYouLeft', { ago: ago(status.leftAt) })
      : t('mapLayers.zoneNobody', { ago: ago(status.leftAt) });
    return (
      <View style={styles.statusLine}>
        {self ? <View style={styles.statusDot} /> : null}
        <Text
          style={self ? styles.rowSubtitle : styles.statusMuted}
          numberOfLines={1}
        >
          {text}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.statusLine}>
      {self ? <View style={[styles.statusDot, styles.statusDotSoft]} /> : null}
      <Text style={styles.statusMuted} numberOfLines={1}>
        {status.updatedAt
          ? t('mapLayers.zoneNoDataAgo', { ago: ago(status.updatedAt) })
          : t('mapLayers.zoneNoDataYet')}
      </Text>
    </View>
  );
}

/** Где ребёнок: в какой области или вне их, и как давно были координаты. */
function MemberPresenceText({
  child,
  zoneName,
  now,
  fallback,
}: {
  child: LocationPresence['children'][number] | undefined;
  zoneName: (zoneId: string) => string | null;
  now: Date;
  fallback: string;
}) {
  const { t } = useTranslation();
  const updatedAt = child?.updatedAt ?? null;
  if (!child || !updatedAt) {
    return (
      <Text style={styles.rowSubtitle} numberOfLines={1}>
        {fallback}
      </Text>
    );
  }
  const age = now.getTime() - Date.parse(updatedAt);
  const ago = formatTimeAgo(new Date(updatedAt), now);
  const insideZone =
    age <= ZONE_STALE_MS
      ? child.zones.find((zone) => zone.state === 'inside')
      : undefined;
  const zone = insideZone ? zoneName(insideZone.zoneId) : null;

  if (zone) {
    return (
      <View style={styles.statusLine}>
        <Icon name="home" size={14} color={theme.colors.homeBrown} />
        <Text style={styles.presenceAt} numberOfLines={1}>
          {t('mapLayers.memberAt', { zone, ago })}
        </Text>
      </View>
    );
  }
  return (
    <Text style={styles.rowSubtitle} numberOfLines={1}>
      {t('mapLayers.memberAway', { ago })}
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
  // Разделы при каждом входе на экран раскрыты, даже пустые; тап по
  // заголовку сворачивает раздел только до ухода с экрана.
  const [openSections, setOpenSections] = useState<
    Record<MapLayerKey, boolean>
  >({ family: true, transport: true, areas: true });
  const toggleSection = (key: MapLayerKey) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  const showAll = useMapLayerStore((state) => state.showAll);

  const [zoneToDelete, setZoneToDelete] = useState<MapZone | null>(null);
  // Смахнутая строка (область или маршрут): открытой остаётся только одна.
  const [openSwipeId, setOpenSwipeId] = useState<string | null>(null);
  const swipeProps = (id: string) => ({
    open: openSwipeId === id,
    onOpenChange: (open: boolean) => setOpenSwipeId(open ? id : null),
    onSwipeStart: () => setOpenSwipeId(null),
  });
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

  const parent = kind === 'parent';
  const memberIds = members.map((member) => member.userId);
  const zoneIds = zones.map((zone) => zone.id);
  const me = members.find((member) => member.userId === myId);
  // Ребёнок видит в областях только себя: «Ты сейчас здесь» / «Не здесь».
  const selfChildId = parent ? null : (me?.childId ?? null);
  const zoneStatusFor = buildZoneStatuses(presence, now, selfChildId);
  const childNames = new Map(
    members
      .filter((member) => member.childId)
      .map((member) => [member.childId!, member] as const),
  );
  const zoneNames = new Map(zones.map((zone) => [zone.id, zone.name]));
  const presenceByChild = new Map(
    (presence?.children ?? []).map((child) => [child.childId, child]),
  );
  const avatarOf = (member: FamilyMember | undefined) =>
    member
      ? {
          name: member.displayName,
          source: member.avatarUrl ? authorizedImage(member.avatarUrl) : null,
        }
      : undefined;
  const pinned = sortRoutes(pinnedRoutes);
  // В шторке — и выбранные, и те, что сейчас на линии.
  const pickerRoutes = sortRoutes(
    Array.from(new Set([...pinnedRoutes, ...routes.map((item) => item.route)])),
  );

  const zoneRow = (zone: MapZone) => {
    const status = zoneStatusFor(zone.id);
    const insideMembers = status.inside
      .map((item) => childNames.get(item.childId))
      .filter((member): member is FamilyMember => !!member)
      .slice(0, 2);
    return (
      <LayerRow
        title={zone.name}
        subtitle={
          <ZoneStatusText
            status={status}
            now={now}
            self={!parent}
            nameOf={(childId) => childNames.get(childId)?.displayName ?? ''}
            selfAvatar={avatarOf(me)}
          />
        }
        icon="zone"
        tall
        accent={parent && status.inside.length > 0}
        aside={
          parent && insideMembers.length > 0 ? (
            <View style={styles.who}>
              {insideMembers.map((member, index) => (
                <LetterAvatar
                  key={member.userId}
                  source={avatarOf(member)!.source}
                  name={member.displayName}
                  style={[styles.whoAvatar, index > 0 && styles.whoOverlap]}
                  letterSize={13}
                />
              ))}
            </View>
          ) : undefined
        }
        checked={areas && !hiddenZones.includes(zone.id)}
        onPress={() =>
          toggleItem('areas', 'zones', areas, hiddenZones, zoneIds, zone.id)
        }
      />
    );
  };

  return (
    <TabScreen activeKey="map">
      <View style={styles.screen}>
        <View style={styles.header}>
          <ScreenHeader
            title={t('mapLayers.title')}
            onBack={back}
            right={
              <RoundButton
                icon="eye"
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
            title={t('mapLayers.family')}
            count={
              members.length > 0
                ? t('mapLayers.membersCount', { count: members.length })
                : undefined
            }
            expanded={openSections.family}
            onToggle={() => toggleSection('family')}
          >
            <SectionList>
              {members.map((member, index) => {
                const role =
                  member.userId === myId
                    ? member.kind === 'child'
                      ? t('mapLayers.youChildRole')
                      : t('mapLayers.youRole')
                    : member.kind === 'child'
                      ? t('mapLayers.childRole')
                      : t('mapLayers.parentRole');
                return (
                  <View key={member.userId}>
                    {index > 0 && <Divider inset />}
                    <LayerRow
                      title={member.displayName}
                      subtitle={
                        member.childId ? (
                          <MemberPresenceText
                            child={presenceByChild.get(member.childId)}
                            zoneName={(id) => zoneNames.get(id) ?? null}
                            now={now}
                            fallback={role}
                          />
                        ) : (
                          role
                        )
                      }
                      avatar={avatarOf(member)}
                      checked={
                        family && !hiddenChildren.includes(member.userId)
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
                    />
                  </View>
                );
              })}
              {members.length === 0 && !membersQuery.isPending && (
                <EmptyRow text={t('mapLayers.emptyChildren')} />
              )}
            </SectionList>
          </Section>

          <Section
            title={t('mapLayers.transportSection')}
            count={
              pinned.length > 0
                ? t('mapLayers.routesCount', { count: pinned.length })
                : undefined
            }
            expanded={openSections.transport}
            onToggle={() => toggleSection('transport')}
          >
            <SectionList>
              {pinned.map((route, index) => (
                <View key={route}>
                  {index > 0 && <Divider inset />}
                  <View style={styles.swipeBack}>
                    <SwipeableRow
                      {...swipeProps(`route:${route}`)}
                      actionsWidth={swipeActionsWidth(1)}
                      actionsGap={SWIPE_ACTION_GAP}
                      actions={[
                        <SwipeAction
                          key="delete"
                          icon="trash"
                          label={t('mapLayers.deleteZoneConfirm')}
                          accessibilityLabel={t('mapLayers.deleteRoute', {
                            route,
                          })}
                          tone="delete"
                          onPress={() => {
                            setOpenSwipeId(null);
                            togglePinnedRoute(route);
                          }}
                        />,
                      ]}
                    >
                      <View style={styles.swipeFront}>
                        <LayerRow
                          title={t('mapLayers.routeTitle', { route })}
                          icon="bus"
                          iconTone="bus"
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
                        />
                      </View>
                    </SwipeableRow>
                  </View>
                </View>
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

          {pinned.length > 0 && openSections.transport ? (
            <View style={styles.swipeHint}>
              <Icon name="arrow-left" size={16} color={theme.colors.grey} />
              <Text style={styles.swipeHintText}>
                {t('mapLayers.swipeRouteHint')}
              </Text>
            </View>
          ) : null}

          <Section
            title={t('mapLayers.areas')}
            count={
              zones.length > 0
                ? t('mapLayers.areasCount', { count: zones.length })
                : undefined
            }
            expanded={openSections.areas}
            onToggle={() => toggleSection('areas')}
          >
            <SectionList>
              {zones.map((zone, index) => (
                <View key={zone.id}>
                  {index > 0 && <Divider />}
                  {parent ? (
                    <View style={styles.swipeBack}>
                      <SwipeableRow
                        {...swipeProps(`zone:${zone.id}`)}
                        actionsWidth={swipeActionsWidth(2)}
                        actionsGap={SWIPE_ACTION_GAP}
                        actions={[
                          <SwipeAction
                            key="edit"
                            icon="pencil"
                            label={t('mapLayers.edit')}
                            accessibilityLabel={t('mapLayers.editZone', {
                              name: zone.name,
                            })}
                            tone="edit"
                            onPress={() => {
                              setOpenSwipeId(null);
                              editZone(zone.id);
                            }}
                          />,
                          <SwipeAction
                            key="delete"
                            icon="trash"
                            label={t('mapLayers.deleteZoneConfirm')}
                            accessibilityLabel={t('mapLayers.deleteZone', {
                              name: zone.name,
                            })}
                            tone="delete"
                            onPress={() => {
                              setOpenSwipeId(null);
                              setZoneToDelete(zone);
                            }}
                          />,
                        ]}
                      >
                        <View style={styles.swipeFront}>{zoneRow(zone)}</View>
                      </SwipeableRow>
                    </View>
                  ) : (
                    zoneRow(zone)
                  )}
                </View>
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

          {parent && zones.length > 0 && openSections.areas ? (
            <View style={styles.swipeHint}>
              <Icon name="arrow-left" size={16} color={theme.colors.grey} />
              <Text style={styles.swipeHintText}>
                {t('mapLayers.swipeHint')}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>

      <BottomSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        maxHeightRatio={0.7}
      >
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{t('mapLayers.addTransport')}</Text>
          {pickerRoutes.length > 0 ? (
            <ScrollView
              style={[
                styles.sheetList,
                { maxHeight: Math.max(140, windowHeight * 0.7 - 180) },
              ]}
              showsVerticalScrollIndicator={false}
            >
              {pickerRoutes.map((route, index) => (
                <View key={route}>
                  {index > 0 && <Divider inset />}
                  <LayerRow
                    title={t('mapLayers.routeTitle', { route })}
                    icon="bus"
                    iconTone="bus"
                    checked={pinnedRoutes.includes(route)}
                    onPress={() => togglePinnedRoute(route)}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.sheetEmpty}>
              <View style={styles.sheetEmptyIcon}>
                <Icon name="bus" size={26} color={theme.colors.busIcon} />
              </View>
              <Text style={styles.sheetEmptyText}>
                {t('mapLayers.emptyTransport')}
              </Text>
            </View>
          )}
          <GradientButton
            label={t('common.done')}
            tone="blue"
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
            <Icon name="trash" size={26} color={theme.colors.dangerText} />
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
              variant="outline"
              disabled={removeZone.isPending}
              onPress={() => setZoneToDelete(null)}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('mapLayers.deleteZoneConfirm')}
              accessibilityState={{ disabled: removeZone.isPending }}
              disabled={removeZone.isPending}
              onPress={() => {
                if (zoneToDelete) removeZone.mutate(zoneToDelete);
              }}
              style={({ pressed }) => [
                styles.confirmDelete,
                (pressed || removeZone.isPending) && styles.pressed,
              ]}
            >
              <Text style={styles.confirmDeleteText}>
                {t('mapLayers.deleteZoneConfirm')}
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </TabScreen>
  );
}

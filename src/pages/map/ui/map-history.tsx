import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  AppState,
  Modal,
  Animated,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFamilyMembers, type FamilyMember } from '@entities/family';
import { apiRequest } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { createStyles, theme } from '@shared/theme';
import { Icon, Wheel } from '@shared/ui';
import {
  type HistoryMapProps,
  type HistoryMarker,
  type HistoryPoint,
} from '@widgets/map';

type HistoryType =
  | 'created'
  | 'submitted'
  | 'withdrawn'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'expired';
type HistoryData = {
  items: {
    id: string;
    type: `task_${HistoryType}`;
    title: string | null;
    at: string;
  }[];
  truncated: boolean;
};
type RouteData = {
  enabled: boolean;
  points: HistoryPoint[];
  truncated: boolean;
};

function timeLabel(value: string, locale?: string) {
  return new Date(value).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function historyDate(offset: number) {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
}

export function MapHistory({
  familyId,
  onRoute,
}: {
  familyId: string;
  onRoute: (route: HistoryMapProps | null) => void;
}) {
  const { t, i18n } = useTranslation();
  const members = useFamilyMembers(familyId);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [choice, setChoice] = useState({ memberId: '', offset: 0 });
  const [draft, setDraft] = useState<{
    kind: 'date' | 'member';
    value: number;
  } | null>(null);
  const [bottomInset, setBottomInset] = useState(0);
  const familyMembers = members.data ?? [];
  const [slide] = useState(() => new Animated.Value(0));
  const selected =
    members.data?.find((member) => member.id === choice.memberId) ??
    members.data?.find((member) => member.childId) ??
    members.data?.[0];
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        setDraft(null);
        setOpen(false);
        setExpanded(false);
      }
    });
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (!open) return;
    slide.setValue(32);
    const animation = Animated.timing(slide, {
      toValue: 0,
      duration: 170,
      useNativeDriver: true,
    });
    animation.start();
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      setOpen(false);
      return true;
    });
    return () => {
      back.remove();
      animation.stop();
    };
  }, [open, slide]);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('mapHistory.title')}
        accessibilityState={{ expanded: open }}
        onPress={() => {
          setOpen((value) => !value);
          setExpanded(false);
        }}
        style={[styles.button, open && styles.active]}
      >
        <Icon
          name="clock"
          size={22}
          color={open ? theme.colors.mapAccent : theme.colors.ink}
        />
      </Pressable>
      {open && (
        <View style={styles.panelWrap} pointerEvents="box-none">
          <Animated.View
            style={[styles.panel, { transform: [{ translateY: slide }] }]}
            onLayout={(event) =>
              setBottomInset(event.nativeEvent.layout.height + 8)
            }
          >
            {members.isError && <Text>{t('mapHistory.error')}</Text>}
            {members.isPending && <Text>{t('mapHistory.loading')}</Text>}
            {selected && (
              <HistoryDay
                key={`${familyId}:${selected.id}:${choice.offset}`}
                familyId={familyId}
                member={selected}
                offset={choice.offset}
                onChoose={(kind) =>
                  setDraft({
                    kind,
                    value:
                      kind === 'date'
                        ? choice.offset
                        : familyMembers.findIndex(
                            (member) => member.id === selected.id,
                          ),
                  })
                }
                onRoute={onRoute}
                bottomInset={bottomInset}
                expanded={expanded}
                onToggle={() => setExpanded((value) => !value)}
              />
            )}
          </Animated.View>
        </View>
      )}
      {open && (
        <View style={styles.legend} pointerEvents="none">
          <View style={styles.legendItem}>
            <View style={styles.routeSwatch} />
            <Text>{t('mapHistory.legendRoute')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.gapSwatch} />
            <Text>{t('mapHistory.legendGap')}</Text>
          </View>
        </View>
      )}
      {draft && open && (
        <Modal
          transparent
          animationType="fade"
          onRequestClose={() => setDraft(null)}
        >
          <View style={styles.wheelOverlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              accessibilityRole="button"
              accessibilityLabel={t('common.cancel')}
              onPress={() => setDraft(null)}
            />
            <View style={styles.wheelCard} accessibilityViewIsModal>
              <Text style={styles.name}>
                {t(
                  draft.kind === 'date'
                    ? 'mapHistory.chooseDate'
                    : 'mapHistory.chooseMember',
                )}
              </Text>
              <Wheel
                width={220}
                visibleRows={5}
                items={
                  draft.kind === 'date'
                    ? Array.from({ length: 7 }, (_, index) => ({
                        value: -index,
                        label: historyDate(-index).toLocaleDateString(
                          i18n.resolvedLanguage,
                          { day: 'numeric', month: 'long' },
                        ),
                      })).reverse()
                    : familyMembers.map((member, index) => ({
                        value: index,
                        label: member.displayName,
                      }))
                }
                value={draft.value}
                onChange={(value) => setDraft({ ...draft, value })}
              />
              <Pressable
                accessibilityRole="button"
                style={styles.option}
                onPress={() => {
                  if (draft.kind === 'date')
                    setChoice({ ...choice, offset: draft.value });
                  else {
                    const member = familyMembers[draft.value];
                    if (member) setChoice({ ...choice, memberId: member.id });
                  }
                  setDraft(null);
                }}
              >
                <Text style={styles.link}>{t('mapHistory.apply')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

function HistoryDay({
  familyId,
  member,
  offset,
  onChoose,
  onRoute,
  bottomInset,
  expanded,
  onToggle,
}: {
  familyId: string;
  member: FamilyMember;
  offset: number;
  onChoose: (kind: 'date' | 'member') => void;
  onRoute: (route: HistoryMapProps | null) => void;
  bottomInset: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage;
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    data?: HistoryData;
    route?: RouteData;
  }>();
  const [selection, select] = useState<string | null>(null);
  const [focusVersion, setFocusVersion] = useState(0);
  const focusMarker = useCallback((id: string) => {
    select(id);
    setFocusVersion((version) => version + 1);
  }, []);
  const from = historyDate(offset);
  const to = historyDate(offset + 1);
  const childId = member.childId;
  const family = `/families/${encodeURIComponent(familyId)}`;
  const bounds = `?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`;
  const child = childId ? `/children/${encodeURIComponent(childId)}` : null;
  const path = child ? `${family}/activity${child}/tasks${bounds}` : null;
  const routePath = child
    ? `${family}${child}/location-history${bounds}`
    : null;
  const requestKey = `${path}:${retry}`;
  const current = result?.key === requestKey ? result : undefined;
  useEffect(() => {
    if (!path || !routePath) return;
    let active = true;
    Promise.allSettled([
      apiRequest<HistoryData>(path),
      apiRequest<RouteData>(routePath),
    ]).then(([tasks, route]) => {
      if (active)
        setResult({
          key: requestKey,
          data: tasks.status === 'fulfilled' ? tasks.value : undefined,
          route: route.status === 'fulfilled' ? route.value : undefined,
        });
    });
    return () => {
      active = false;
    };
  }, [path, requestKey, routePath]);

  const { points, tasks, checkpoints, groups, markers } = useMemo(() => {
    const points = current?.route?.points ?? [];
    const checkpoints = points.flatMap((point) =>
      point.transitions.map((transition) => ({
        id: `${point.recordedAt}:${transition.zoneId}`,
        lat: point.lat,
        lng: point.lng,
        title: transition.zoneName,
        detail: t(
          transition.to === 'inside'
            ? 'mapHistory.entered'
            : 'mapHistory.exited',
        ),
        at: point.recordedAt,
      })),
    );
    const tasks =
      current?.data?.items.filter((item) => item.type === 'task_submitted') ??
      [];
    const groups: (HistoryMarker & { tasks: string[] })[] = [];
    for (const task of [...tasks].reverse()) {
      if (!task.title) continue;
      let match: HistoryPoint | undefined;
      const at = Date.parse(task.at);
      for (const point of points) {
        const elapsed = at - Date.parse(point.recordedAt);
        if (
          elapsed >= 0 &&
          elapsed <= 90_000 &&
          point.accuracy !== null &&
          point.accuracy <= 50
        )
          match = point;
      }
      if (!match) continue;
      const { lat, lng } = match;
      const existing = groups.find(
        (group) =>
          Math.hypot(
            (group.lat - lat) * 111_000,
            (group.lng - lng) * 111_000 * Math.cos((lat * Math.PI) / 180),
          ) <= 30,
      );
      const detail = `${timeLabel(task.at, locale)} · ${task.title}`;
      if (existing) {
        existing.tasks.push(task.id);
        existing.label = String(existing.tasks.length);
        existing.detail += `\n${detail}`;
      } else {
        groups.push({
          id: task.id,
          label: '✓',
          lat,
          lng,
          detail: `${t('mapHistory.approximatePlace')}\n${detail}`,
          task: true,
          tasks: [task.id],
        });
      }
    }
    const markers = [
      ...checkpoints.map((point, index) => ({
        ...point,
        label: String(index + 1),
        detail: `${timeLabel(point.at, locale)} · ${point.title} · ${point.detail}`,
      })),
      ...groups,
    ];
    return { points, tasks, checkpoints, groups, markers };
  }, [current, locale, t]);
  useLayoutEffect(() => {
    onRoute(
      points.length
        ? {
            points,
            markers,
            selected: selection,
            focusVersion,
            onSelect: focusMarker,
            bottomInset,
            routeKey: requestKey,
          }
        : null,
    );
  }, [
    bottomInset,
    focusMarker,
    focusVersion,
    markers,
    onRoute,
    points,
    requestKey,
    selection,
  ]);
  useLayoutEffect(() => () => onRoute(null), [onRoute]);
  const entries = [
    ...checkpoints.map((item, index) => ({
      ...item,
      badge: String(index + 1),
      done: false,
    })),
    ...tasks.map((item) => ({
      ...item,
      badge: '✓',
      done: true,
      detail: t('mapHistory.completed'),
    })),
  ].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  return (
    <>
      <View style={styles.compactDock}>
        <View style={styles.headerBadge} accessible={false}>
          <Text style={styles.link}>↗</Text>
        </View>
        <View style={styles.headerLabels}>
          <Pressable
            accessibilityRole="button"
            style={styles.headerButton}
            onPress={() => onChoose('date')}
          >
            <Text style={styles.headerText}>
              {from.toLocaleDateString(locale, {
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          </Pressable>
          <Text style={styles.headerText} accessible={false}>
            ·
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={member.displayName}
            style={[styles.headerButton, styles.headerMember]}
            onPress={() => onChoose('member')}
          >
            <Text style={styles.headerText} numberOfLines={1}>
              {member.displayName}
            </Text>
          </Pressable>
        </View>
        {current && (
          <Text style={styles.count}>
            {entries.length} {locale?.startsWith('ru') ? 'соб.' : 'evt.'}
          </Text>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('mapHistory.checkpoints')}
          accessibilityState={{ expanded }}
          style={styles.option}
          onPress={onToggle}
        >
          <Text style={styles.compactArrow}>{expanded ? '⌄' : '⌃'}</Text>
        </Pressable>
      </View>
      {expanded && (
        <ScrollView
          style={styles.checkpointsScroll}
          contentContainerStyle={styles.checkpointPanel}
          nestedScrollEnabled
        >
          {!path && <Text>{t('mapHistory.unavailable')}</Text>}
          {path && !current && <Text>{t('mapHistory.loading')}</Text>}
          {current && (!current.data || !current.route) && (
            <Pressable
              accessibilityRole="button"
              style={styles.member}
              onPress={() => setRetry((count) => count + 1)}
            >
              <Text style={styles.link}>{t('mapHistory.error')}</Text>
            </Pressable>
          )}
          {current &&
            entries.length === 0 &&
            (current.data || current.route) && (
              <Text>{t('mapHistory.empty')}</Text>
            )}
          {entries.map((item) => {
            const markerId = item.done
              ? groups.find((group) => group.tasks.includes(item.id))?.id
              : item.id;
            return (
              <Pressable
                accessibilityRole={markerId ? 'button' : undefined}
                disabled={!markerId}
                key={item.id}
                style={[
                  styles.row,
                  styles.event,
                  selection !== null &&
                    (selection === item.id ||
                      groups.some(
                        (group) =>
                          group.id === selection &&
                          group.tasks.includes(item.id),
                      )) &&
                    styles.active,
                ]}
                onPress={
                  markerId
                    ? () => {
                        focusMarker(markerId);
                      }
                    : undefined
                }
              >
                <View style={[styles.badge, item.done && styles.doneBadge]}>
                  <Text style={item.done ? styles.doneText : styles.link}>
                    {item.badge}
                  </Text>
                </View>
                <View style={styles.eventCopy}>
                  {item.title && <Text style={styles.name}>{item.title}</Text>}
                  <Text style={styles.caption}>{item.detail}</Text>
                  {!markerId && (
                    <Text style={styles.caption}>
                      {t('mapHistory.noTaskLocation')}
                    </Text>
                  )}
                </View>
                <Text style={styles.caption}>{timeLabel(item.at, locale)}</Text>
              </Pressable>
            );
          })}
          {current?.data?.truncated && <Text>{t('mapHistory.truncated')}</Text>}
          {current?.route && points.length === 0 && (
            <Text>
              {t(
                current.route.enabled
                  ? 'mapHistory.noRoute'
                  : 'mapHistory.recordingOff',
              )}
            </Text>
          )}
          {current?.route?.truncated && (
            <Text>{t('mapHistory.routeTruncated')}</Text>
          )}
          {points.length > 0 && (
            <Text style={styles.caption}>
              {t('mapHistory.lastSignal', {
                time: timeLabel(points[points.length - 1].recordedAt, locale),
              })}
            </Text>
          )}
        </ScrollView>
      )}
    </>
  );
}

const styles = createStyles((colors) => ({
  headerLabels: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerButton: { minHeight: 44, justifyContent: 'center' },
  headerMember: { flexShrink: 1, minWidth: 0 },
  headerText: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  headerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.mapAccentTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.12)',
  },
  wheelCard: {
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  option: {
    minHeight: 44,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 10,
  },
  legend: {
    position: 'absolute',
    top: 24,
    maxWidth: '65%',
    zIndex: 5,
    alignSelf: 'center',
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: colors.surface,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeSwatch: {
    width: 18,
    borderTopWidth: 3,
    borderColor: colors.mapAccent,
  },
  gapSwatch: {
    width: 18,
    borderTopWidth: 3,
    borderStyle: 'dashed',
    borderColor: colors.grey,
  },
  button: {
    position: 'absolute',
    top: 64,
    left: 16,
    zIndex: 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
  compactDock: {
    minHeight: 44,
    paddingHorizontal: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
  },
  compactArrow: { color: colors.ink, fontSize: 18 },
  count: { color: colors.ink, fontSize: 14 },
  active: { backgroundColor: colors.mapAccentTint },
  panelWrap: {
    position: 'absolute',
    top: '48%',
    bottom: 8,
    left: 10,
    right: 10,
    justifyContent: 'flex-end',
    zIndex: 5,
  },
  panel: {
    flexShrink: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingTop: 4,
    paddingHorizontal: 10,
    paddingBottom: 8,
    borderRadius: 18,
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.14)',
    backgroundColor: colors.surface,
  },
  checkpointsScroll: { flexGrow: 0, flexShrink: 1, maxHeight: 185 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  event: {
    minHeight: 52,
    padding: 8,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  checkpointPanel: {
    paddingHorizontal: 0,
    paddingBottom: 4,
    gap: 8,
    borderRadius: 22,
    backgroundColor: colors.surface,
  },
  badge: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: colors.mapAccentTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneBadge: { backgroundColor: colors.readySoft },
  doneText: { color: colors.readyText, fontWeight: '700' },
  caption: { color: colors.inkSoft, fontSize: 13 },
  eventCopy: { flex: 1, gap: 3 },
  name: { fontWeight: '600', color: colors.ink },
  link: { color: colors.mapAccent, fontWeight: '700' },
  member: { minHeight: 44, paddingHorizontal: 10, justifyContent: 'center' },
}));

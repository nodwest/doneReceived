import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import {
  ChildrenFilter,
  type ChildFilterValue,
} from '@widgets/children-filter';
import { DaySummary } from '@widgets/day-summary';
import { OperationsChart } from '@widgets/operations-chart';
import {
  MissedTaskCard,
  MissedTaskTile,
  PaidTaskCard,
  PaidTaskTile,
  RewardKindToggle,
} from '@widgets/paid-task-card';
import {
  useRewardById,
  useRewardPeriod,
  isSameDay,
  OperationRow,
  sortByNewest,
  type Operation,
  type OperationKind,
} from '@entities/operation';
import {
  useChildAccount,
  useOperationsViewer,
  useMyWishlistOwner,
  useTaskFamilyId,
} from '@features/family-tasks';
import { useFamilyChildren, useFamilyMembers } from '@entities/family';
import { useMe, useMyAvatar, useMyId } from '@entities/session';
import { TaskIconBadge } from '@entities/task';
import { getRewardGoal, useWishes } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import {
  addDays,
  formatDayLabel,
  formatMonthDay,
  startOfDay,
} from '@shared/lib';
import { theme, useTheme } from '@shared/theme';
import { Button, RoundButton, SnapCarousel } from '@shared/ui';
import { indexOperations } from '../model/rewards-index';
import { styles } from './rewards-history.styled';
import { authorizedImage } from '@shared/api';

const NO_OPERATIONS: Operation[] = [];

function dayKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

/**
 * История наград по дням (открывается из Wallet и «See all» в профилях):
 * заработанные и упущенные награды на графике, итоги и задания выбранного
 * дня — выплаченные и упущенные (серые) вперемешку по времени. У родителя —
 * только награды по его заданиям. Фильтр по детям задаёт, чьи задания и в
 * графике, и в карточках, и в списке. Тап по строке или кнопка карточек
 * справа в шапке открывают карточки заданий этого дня (листаются); в шапке
 * карточек и списка вместо заголовка тогл Done / Missed — выплаченные
 * (зелёные) или упущенные (графитовые); упущенных нет — пусто. «Назад» —
 * обратно к графику на тот же день. Кнопка списка в карточках открывает все
 * задания этого вида плитками по дням (с суммой за день); тап по плитке — её
 * карточка. С childId — история одного ребёнка от его лица: без фильтра по
 * детям, в строках вместо аватара значок задания (зелёный или серый), в
 * карточке — на сколько награда приблизила желание.
 */
export function RewardsHistoryPage({ childId }: { childId?: string }) {
  useTheme();
  const myId = useMyId();
  const { t } = useTranslation();
  const operationsViewer = useOperationsViewer();
  // Кто дал и подтвердил задание: вошедший родитель — из его профиля,
  // остальные — из участников семьи (их видит и ребёнок; без фото — буква),
  // не нашли — «Родитель».
  const me = useMe();
  const myAvatar = useMyAvatar();
  const familyId = useTaskFamilyId();
  const { data: members } = useFamilyMembers(familyId);
  const findApprover = (id: string) => {
    if (me?.kind !== 'child' && id === myId && me) {
      return { name: me.displayName, avatar: myAvatar };
    }
    const member = members?.find((item) => item.userId === id);
    return {
      name: member?.displayName ?? t('member.parent'),
      avatar: member?.avatarUrl ? authorizedImage(member.avatarUrl) : null,
    };
  };
  // Фильтр по детям семьи (ребёнку список закрыт — у него фильтра нет).
  const { data: serverChildren } = useFamilyChildren(
    childId === undefined ? familyId : null,
  );
  const filterChildren = useMemo(
    () =>
      (serverChildren ?? []).map((child) => ({
        id: child.id,
        name: child.displayName,
        avatar: child.avatarUrl ? authorizedImage(child.avatarUrl) : null,
      })),
    [serverChildren],
  );
  const { data: wishes } = useWishes(useMyWishlistOwner());
  // Сегодня фиксируем на время жизни экрана: от него строится лента дней.
  const [today] = useState(() => new Date());
  // «See all» в профиле ребёнка открывает историю сразу с его фильтром;
  // operation — сразу карточку этой награды (из карточки транзакции).
  const { child: childParam, operation: operationParam } =
    useLocalSearchParams<{ child?: string; operation?: string }>();
  // Дети с сервера могут ещё грузиться — берём id из ссылки как есть.
  const [selectedChild, setFilter] = useState<ChildFilterValue>(
    () => childParam ?? 'all',
  );
  const filter = childId ?? selectedChild;
  // null — день не выбран, стоим на сегодняшнем (последнем).
  const [selected, setSelected] = useState<number | null>(null);
  // Номер открытой карточки среди заданий дня этого вида; null — график.
  const [card, setCard] = useState<number | null>(null);
  // Что показывают карточки и список: выплаченные (Done) или упущенные.
  const [kind, setKind] = useState<OperationKind>('earned');
  // Все задания этого вида списком по дням (открывается из карточек).
  const [paidList, setPaidList] = useState(false);
  // Открыли по ссылке на награду: «назад» из карточки уводит туда, откуда
  // пришли, а не к графику.
  const [linked, setLinked] = useState<string | undefined>(operationParam);
  const [linkPending, setLinkPending] = useState(operationParam !== undefined);

  const [month, setMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [handledLink, setHandledLink] = useState<string>();
  const rewardQuery = useRewardById(
    operationsViewer,
    linkPending ? operationParam : undefined,
  );
  const linkedReward = rewardQuery.data;
  if (linkPending && linkedReward && handledLink !== linkedReward.id) {
    const date = new Date(linkedReward.at);
    setHandledLink(linkedReward.id);
    setFilter(linkedReward.child.id);
    setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setSelected(date.getDate() - 1);
  }
  const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
  const tomorrow = addDays(startOfDay(today), 1);
  const end = nextMonth < tomorrow ? nextMonth : tomorrow;
  const endTime = end.getTime();
  const historyQuery = useRewardPeriod(
    operationsViewer,
    {
      from: month.toISOString(),
      to: end.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC',
    },
    filter,
  );
  const { isPending } = historyQuery;
  const days = useMemo(() => {
    const result: Date[] = [];
    for (let date = month; date.getTime() < endTime; date = addDays(date, 1))
      result.push(date);
    return result;
  }, [month, endTime]);
  const filtered = useMemo(
    () => sortByNewest(historyQuery.data?.operations ?? NO_OPERATIONS),
    [historyQuery.data],
  );
  // Один проход по операциям месяца: дни, виды, итоги и группы для списка.
  const index = useMemo(() => indexOperations(filtered), [filtered]);
  const totals = useMemo(
    () =>
      days.map((date) => ({
        date,
        // Начисленное сервер уже сгруппировал по дням с учётом своего часового
        // пояса, упущенное берём из индекса.
        earned: historyQuery.data?.earnedByDay.get(dayKey(date)) ?? 0,
        missed: index.totals(date).missed,
      })),
    [days, index, historyQuery.data],
  );

  const changeMonth = (delta: number) => {
    setSelected(null);
    setLinkPending(false);
    setLinked(undefined);
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  };

  /** Задания дня одного вида — в том порядке, в каком листаются карточки. */
  const ofDay = (date: Date, of: OperationKind) => index.dayKind(date, of);

  // Карточка награды: встаём на её день и вид и открываем её среди заданий
  // дня.
  const openCard = (operation: Operation) => {
    const dayIndex = days.findIndex((date) => isSameDay(operation, date));
    if (dayIndex < 0) return false;
    setSelected(dayIndex);
    setKind(operation.kind);
    setCard(
      Math.max(ofDay(days[dayIndex], operation.kind).indexOf(operation), 0),
    );
    return true;
  };

  if (linkPending && linkedReward && historyQuery.isSuccess) {
    const target = filtered.find(
      (operation) => operation.id === linkedReward.id,
    );
    if (target && openCard(target)) setLinkPending(false);
  }

  const selectedIndex = Math.min(selected ?? days.length - 1, days.length - 1);
  const day = totals[selectedIndex];
  // В списке под графиком — и выплаченные, и упущенные (серые), по времени.
  const dayOperations = index.day(day.date);
  const dayKind = index.dayKind(day.date, kind);
  const cards = card !== null;
  const list = paidList && !cards;
  const missed = kind === 'missed';

  // Список: задания выбранного вида по дням, новые сверху, с суммой за день.
  const listDays = index.groups(kind);

  const goalFor = (operation: Operation) => {
    const after = operation.balanceAfter;
    if (childId === undefined || !wishes || after === undefined) return null;
    return getRewardGoal(wishes, after - operation.amount, after);
  };

  // Тогл Done / Missed: в карточках — первая карточка дня этого вида.
  const changeKind = (next: OperationKind) => {
    setKind(next);
    setLinked(undefined);
    if (cards) setCard(0);
  };

  const leave = () =>
    // Назад — туда, откуда пришли (Wallet, профиль); без истории (открыли по
    // ссылке) — в Wallet.
    router.canGoBack() ? router.back() : router.replace('/wallet');

  const viewer = childId === undefined ? 'parent' : 'child';
  const emptyKind = missed
    ? t('rewardsHistory.noMissedTasks')
    : t('rewardsHistory.noPaidTasks');

  return (
    <TabScreen activeKey="wallet" navHidden={cards || list}>
      <View style={styles.header}>
        <RoundButton
          icon="arrow-left"
          accessibilityLabel={t('common.back')}
          onPress={
            cards && !linked
              ? () => setCard(null)
              : list
                ? () => setPaidList(false)
                : leave
          }
        />
        {cards || list ? (
          <View style={styles.toggle}>
            <RewardKindToggle value={kind} onChange={changeKind} />
          </View>
        ) : (
          <Text style={styles.title} numberOfLines={1}>
            {t('rewardsHistory.title')}
          </Text>
        )}
        {cards ? (
          <RoundButton
            icon="list"
            accessibilityLabel={t('tasks.showAsList')}
            onPress={() => {
              setLinked(undefined);
              setCard(null);
              setPaidList(true);
            }}
          />
        ) : list ? (
          listDays.length > 0 ? (
            <RoundButton
              icon="cards"
              accessibilityLabel={t('tasks.showAsCards')}
              onPress={() => openCard(listDays[0].items[0])}
            />
          ) : (
            <View style={styles.headerSpacer} />
          )
        ) : dayOperations.length > 0 ? (
          <RoundButton
            icon="cards"
            accessibilityLabel={t('tasks.showAsCards')}
            onPress={() => {
              // Выплаченные дня первыми; нет их — сразу упущенные.
              setKind(
                dayOperations.some((operation) => operation.kind === 'earned')
                  ? 'earned'
                  : 'missed',
              );
              setCard(0);
            }}
          />
        ) : (
          // Место кнопки держится, чтобы заголовок оставался по центру.
          <View style={styles.headerSpacer} />
        )}
      </View>
      {cards ? (
        dayKind.length === 0 ? (
          <Text style={styles.emptyCards}>{emptyKind}</Text>
        ) : (
          <View style={styles.cards}>
            <SnapCarousel
              // Другой вид — другая лента: начинается со своей карточки.
              key={kind}
              items={dayKind}
              keyExtractor={(operation) => operation.id}
              initialIndex={Math.min(card, dayKind.length - 1)}
              onIndexChange={setCard}
              peek={0}
              gutter={16}
              fill
              dotColor={missed ? theme.colors.missedDeep : theme.colors.earned}
              renderItem={(operation, style) =>
                missed ? (
                  <MissedTaskCard
                    operation={operation}
                    viewer={viewer}
                    author={findApprover(operation.parentId)}
                    style={style}
                  />
                ) : (
                  <PaidTaskCard
                    operation={operation}
                    viewer={viewer}
                    approver={findApprover(operation.parentId)}
                    goal={goalFor(operation)}
                    style={style}
                  />
                )
              }
            />
          </View>
        )
      ) : list ? (
        <ScrollView
          bounces={false}
          overScrollMode="never"
          contentContainerStyle={styles.paidList}
          showsVerticalScrollIndicator={false}
        >
          {childId === undefined && (
            <ChildrenFilter
              items={filterChildren}
              value={filter}
              onChange={setFilter}
            />
          )}
          {listDays.length === 0 ? (
            <Text style={styles.empty}>{emptyKind}</Text>
          ) : (
            listDays.map((group) => (
              <View key={group.date.getTime()} style={styles.paidDay}>
                <View style={styles.paidDayHead}>
                  <Text style={styles.paidDayTitle}>
                    {formatDayLabel(group.date, today)}
                  </Text>
                  <Text
                    style={[
                      styles.paidDayTotal,
                      missed && styles.missedDayTotal,
                    ]}
                  >
                    {missed
                      ? t('rewardsHistory.missedTotal', { amount: group.total })
                      : `+$${group.total}`}
                  </Text>
                </View>
                {group.items.map((operation) =>
                  missed ? (
                    <MissedTaskTile
                      key={operation.id}
                      operation={operation}
                      viewer={viewer}
                      author={findApprover(operation.parentId)}
                      onPress={openCard}
                    />
                  ) : (
                    <PaidTaskTile
                      key={operation.id}
                      operation={operation}
                      viewer={viewer}
                      approver={findApprover(operation.parentId)}
                      onPress={openCard}
                    />
                  ),
                )}
              </View>
            ))
          )}
        </ScrollView>
      ) : (
        <ScrollView
          bounces={false}
          overScrollMode="never"
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {childId === undefined ? (
            <View style={styles.filter}>
              <ChildrenFilter
                items={filterChildren}
                value={filter}
                onChange={setFilter}
              />
            </View>
          ) : (
            <View style={styles.noFilter} />
          )}
          <View style={styles.period}>
            <RoundButton
              icon="arrow-left"
              accessibilityLabel={t('calendar.previousMonth')}
              onPress={() => changeMonth(-1)}
            />
            <Text style={styles.periodLabel}>
              {month.toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            {nextMonth <= today ? (
              <RoundButton
                icon="arrow-right"
                accessibilityLabel={t('calendar.nextMonth')}
                onPress={() => changeMonth(1)}
              />
            ) : (
              <View style={styles.headerSpacer} />
            )}
          </View>
          {historyQuery.isError || (linkPending && rewardQuery.isError) ? (
            <Button
              onPress={() => {
                if (historyQuery.isError) void historyQuery.refetch();
                if (rewardQuery.isError) void rewardQuery.refetch();
              }}
            >
              <Text style={styles.empty}>{t('common.retry')}</Text>
            </Button>
          ) : null}
          {linkPending &&
          (rewardQuery.data === null ||
            (linkedReward &&
              historyQuery.isSuccess &&
              !filtered.some(
                (operation) => operation.id === linkedReward.id,
              ))) ? (
            <Text style={styles.empty}>
              {t('rewardsHistory.rewardUnavailable')}
            </Text>
          ) : null}
          {!isPending && !historyQuery.isError && (
            <>
              <OperationsChart
                key={month.toISOString()}
                days={totals}
                selectedIndex={selectedIndex}
                onSelect={setSelected}
              />
              <View style={styles.summary}>
                <DaySummary
                  inline
                  title={formatMonthDay(day.date)}
                  earned={day.earned}
                  missed={day.missed}
                />
              </View>
              <View style={styles.list}>
                {dayOperations.length === 0 ? (
                  <Text style={styles.empty}>
                    {t('rewardsHistory.noRewardsThisDay')}
                  </Text>
                ) : (
                  dayOperations.map((operation) =>
                    childId === undefined ? (
                      <OperationRow
                        key={operation.id}
                        {...operation}
                        onPress={() => openCard(operation)}
                      />
                    ) : (
                      <OperationRow
                        key={operation.id}
                        {...operation}
                        caption="time"
                        leading={
                          <TaskIconBadge size={44} tone={operation.kind} />
                        }
                        onPress={() => openCard(operation)}
                      />
                    ),
                  )
                )}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </TabScreen>
  );
}

/** История наград вошедшего ребёнка от его лица. */
export function ChildRewardsHistoryPage() {
  useTheme();
  const { childId } = useChildAccount();
  return <RewardsHistoryPage childId={childId ?? ''} />;
}

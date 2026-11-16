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
  getDayTotals,
  getHistoryDays,
  isSameDay,
  OperationRow,
  sortByNewest,
  type Operation,
  type OperationKind,
} from '@entities/operation';
import {
  useChildAccount,
  useFamilyOperations,
  useMyChildWallet,
  useMyWishlistOwner,
  useTaskFamilyId,
} from '@features/family-tasks';
import { useFamilyChildren, useFamilyMembers } from '@entities/family';
import { useMe, useMyAvatar, useMyId } from '@entities/session';
import { TaskIconBadge } from '@entities/task';
import { balanceAfter } from '@entities/wallet';
import { getRewardGoal, useWishes } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { formatDayLabel, formatMonthDay, startOfDay } from '@shared/lib';
import { theme } from '@shared/theme';
import { RoundButton, SnapCarousel } from '@shared/ui';
import { styles } from './rewards-history.styled';
import { authorizedImage } from '@shared/api';

const NO_OPERATIONS: Operation[] = [];

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
  const myId = useMyId();
  const { t } = useTranslation();
  const { data: allOperations = NO_OPERATIONS, isPending } =
    useFamilyOperations();
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
  // Родитель видит награды только по своим заданиям — те, что выплатил из
  // своего кошелька; ребёнок — все свои награды, от любого родителя.
  const operations = useMemo(
    () =>
      childId === undefined
        ? allOperations.filter((operation) => operation.parentId === myId)
        : allOperations,
    [allOperations, childId, myId],
  );
  // Копилка — только в истории от лица ребёнка: его вишлист и кошелёк.
  const { data: wishes } = useWishes(useMyWishlistOwner());
  const { data: childWallet } = useMyChildWallet();
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

  // Лента дней общая для всех детей, чтобы при смене фильтра не прыгала.
  const days = useMemo(
    () => getHistoryDays(operations, today),
    [operations, today],
  );
  const filtered = useMemo(
    () =>
      sortByNewest(
        filter === 'all'
          ? operations
          : operations.filter((operation) => operation.child.id === filter),
      ),
    [operations, filter],
  );
  const totals = useMemo(() => getDayTotals(days, filtered), [days, filtered]);

  /** Задания дня одного вида — в том порядке, в каком листаются карточки. */
  const ofDay = (date: Date, of: OperationKind) =>
    filtered.filter(
      (operation) => operation.kind === of && isSameDay(operation, date),
    );

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

  // Ссылка на награду: как только история пришла, встаём на её день и
  // открываем её карточку (один раз).
  if (linkPending && operations.length > 0) {
    setLinkPending(false);
    const target = filtered.find(
      // Ссылка из транзакции: id награды или (выплата с сервера) назначения.
      (operation) =>
        operation.id === operationParam ||
        (operation.kind === 'earned' &&
          operation.assignmentId === operationParam),
    );
    if (!target || !openCard(target)) setLinked(undefined);
  }

  const selectedIndex = selected ?? days.length - 1;
  const day = totals[selectedIndex];
  // В списке под графиком — и выплаченные, и упущенные (серые), по времени.
  const dayOperations = useMemo(
    () => filtered.filter((operation) => isSameDay(operation, day.date)),
    [filtered, day.date],
  );
  const dayKind = dayOperations.filter((operation) => operation.kind === kind);
  const cards = card !== null;
  const list = paidList && !cards;
  const missed = kind === 'missed';

  // Список: задания выбранного вида по дням, новые сверху, с суммой за день.
  const listDays = useMemo(() => {
    const groups: { date: Date; items: Operation[]; total: number }[] = [];
    for (const operation of filtered) {
      if (operation.kind !== kind) continue;
      const date = startOfDay(new Date(operation.at));
      const last = groups[groups.length - 1];
      if (last && last.date.getTime() === date.getTime()) {
        last.items.push(operation);
        last.total += operation.amount;
      } else {
        groups.push({ date, items: [operation], total: operation.amount });
      }
    }
    return groups;
  }, [filtered, kind]);

  // Копилка ребёнка после награды: баланс сразу после неё по его
  // транзакциям (награды и выводы на карту).
  const goalFor = (operation: Operation) => {
    if (childId === undefined || !wishes || !childWallet) return null;
    const reward = childWallet.transactions.find(
      (item) => item.kind === 'reward' && item.operationId === operation.id,
    );
    if (!reward) return null;
    const after = balanceAfter(
      childWallet.transactions,
      childWallet.balance,
      reward,
    );
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
          {!isPending && (
            <>
              <OperationsChart
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
  const { childId } = useChildAccount();
  return <RewardsHistoryPage childId={childId ?? ''} />;
}

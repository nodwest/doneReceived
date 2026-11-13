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
import { PaidTaskCard, PaidTaskTile } from '@widgets/paid-task-card';
import {
  getDayTotals,
  getHistoryDays,
  isSameDay,
  OperationRow,
  type Operation,
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
import {
  childAccountMock,
  childrenMock,
  parentProfilesMock,
} from '@shared/mocks';
import { theme } from '@shared/theme';
import { RoundButton, SnapCarousel } from '@shared/ui';
import { styles } from './rewards-history.styled';

const NO_OPERATIONS: Operation[] = [];

/**
 * История наград по дням (открывается из Wallet и «See all» в профилях):
 * заработанные и упущенные награды на графике, итоги и награды выбранного дня.
 * У родителя — только награды по его заданиям (выплаченные из его кошелька).
 * Тап по награде или кнопка карточек справа в шапке открывают карточки
 * выплаченных заданий этого дня (листаются), «назад» — обратно к графику на
 * тот же день. Кнопка списка в карточках открывает все выплаченные задания
 * плитками по дням (с суммой за день); тап по плитке — её карточка, «назад»
 * из неё — снова к списку, «назад» из списка — к графику. С childId — история одного ребёнка от
 * его лица: без фильтра по детям, в голубых тонах, в строках вместо аватара
 * значок задания, в карточке — на сколько награда приблизила желание.
 */
export function RewardsHistoryPage({ childId }: { childId?: string }) {
  const myId = useMyId();
  const { t } = useTranslation();
  const { data: allOperations = NO_OPERATIONS, isPending } =
    useFamilyOperations();
  // Кто дал и подтвердил задание: вошедший родитель — из его профиля, моковые
  // — из моков, родители с сервера — из участников семьи (их видит и
  // ребёнок; фото нет — буква), не нашли — «Родитель».
  const me = useMe();
  const myAvatar = useMyAvatar();
  const familyId = useTaskFamilyId();
  const { data: members } = useFamilyMembers(familyId);
  const findApprover = (id: string) => {
    if (me?.kind !== 'child' && id === myId && me) {
      return { name: me.displayName, avatar: myAvatar };
    }
    const mock = parentProfilesMock.find((parent) => String(parent.id) === id);
    if (mock) return mock;
    const member = members?.find((item) => item.userId === id);
    return {
      name: member?.displayName ?? t('member.parent'),
      avatar: null,
    };
  };
  // Фильтр по детям: моковые Emma и Liam и дети семьи с сервера.
  const { data: serverChildren } = useFamilyChildren(familyId);
  const filterChildren = useMemo(
    () => [
      ...childrenMock.map((child) => ({
        id: String(child.id),
        name: child.name,
        avatar: child.avatar,
      })),
      ...(serverChildren ?? []).map((child) => ({
        id: child.id,
        name: child.displayName,
        avatar: child.avatarUrl ? { uri: child.avatarUrl } : null,
      })),
    ],
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
  // Номер открытой карточки среди наград дня; null — показан график.
  const [card, setCard] = useState<number | null>(null);
  // Все выплаченные задания списком по дням (открывается из карточек).
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
      filter === 'all'
        ? operations
        : operations.filter((operation) => operation.child.id === filter),
    [operations, filter],
  );
  const totals = useMemo(() => getDayTotals(days, filtered), [days, filtered]);

  // Ссылка на награду: как только история пришла, встаём на её день и
  // открываем её карточку (один раз).
  if (linkPending && operations.length > 0) {
    setLinkPending(false);
    const target = filtered.find(
      // Ссылка из транзакции: id награды или (выплата с сервера) назначения.
      (operation) =>
        String(operation.id) === operationParam ||
        operation.assignmentId === operationParam,
    );
    const dayIndex = target
      ? days.findIndex((date) => isSameDay(target, date))
      : -1;
    if (target && dayIndex >= 0) {
      const sameDay = filtered.filter(
        (operation) =>
          operation.kind === 'earned' && isSameDay(operation, days[dayIndex]),
      );
      setSelected(dayIndex);
      setCard(Math.max(sameDay.indexOf(target), 0));
    } else {
      setLinked(undefined);
    }
  }

  const selectedIndex = selected ?? days.length - 1;
  const day = totals[selectedIndex];
  // В списке — начисленные награды; упущенные видны в итогах и на графике.
  const dayOperations = useMemo(
    () =>
      filtered.filter(
        (operation) =>
          operation.kind === 'earned' && isSameDay(operation, day.date),
      ),
    [filtered, day.date],
  );
  const cards = card !== null && dayOperations.length > 0;
  const list = paidList && !cards;

  // Список: выплаченные задания по дням, новые сверху, с суммой за день.
  const paidDays = useMemo(() => {
    const groups: { date: Date; items: Operation[]; total: number }[] = [];
    const earned = filtered
      .filter((operation) => operation.kind === 'earned')
      .sort((a, b) => b.at.localeCompare(a.at));
    for (const operation of earned) {
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
  }, [filtered]);

  // Карточка награды: встаём на её день и открываем её среди наград дня (в
  // том же порядке, что и dayOperations).
  const openCard = (operation: Operation) => {
    const dayIndex = days.findIndex((date) => isSameDay(operation, date));
    if (dayIndex < 0) return;
    const sameDay = filtered.filter(
      (item) => item.kind === 'earned' && isSameDay(item, days[dayIndex]),
    );
    setSelected(dayIndex);
    setCard(Math.max(sameDay.indexOf(operation), 0));
  };

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

  const leave = () =>
    // Назад — туда, откуда пришли (Wallet, профиль); без истории (открыли по
    // ссылке) — в Wallet.
    router.canGoBack() ? router.back() : router.replace('/wallet');

  const title =
    cards || list
      ? childId === undefined
        ? t('rewardsHistory.paidTasks')
        : t('rewardsHistory.myRewards')
      : t('rewardsHistory.title');

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
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
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
          paidDays.length > 0 ? (
            <RoundButton
              icon="cards"
              accessibilityLabel={t('tasks.showAsCards')}
              onPress={() => openCard(paidDays[0].items[0])}
            />
          ) : (
            <View style={styles.headerSpacer} />
          )
        ) : dayOperations.length > 0 ? (
          <RoundButton
            icon="cards"
            accessibilityLabel={t('tasks.showAsCards')}
            onPress={() => setCard(0)}
          />
        ) : (
          // Место кнопки держится, чтобы заголовок оставался по центру.
          <View style={styles.headerSpacer} />
        )}
      </View>
      {cards ? (
        <View style={styles.cards}>
          <SnapCarousel
            items={dayOperations}
            keyExtractor={(operation) => operation.id}
            initialIndex={card}
            onIndexChange={setCard}
            peek={0}
            gutter={16}
            fill
            dotColor={theme.colors.earned}
            renderItem={(operation, style) => (
              <PaidTaskCard
                operation={operation}
                viewer={childId === undefined ? 'parent' : 'child'}
                approver={findApprover(operation.parentId)}
                goal={goalFor(operation)}
                style={style}
              />
            )}
          />
        </View>
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
          {paidDays.length === 0 ? (
            <Text style={styles.empty}>{t('rewardsHistory.noRewards')}</Text>
          ) : (
            paidDays.map((group) => (
              <View key={group.date.getTime()} style={styles.paidDay}>
                <View style={styles.paidDayHead}>
                  <Text style={styles.paidDayTitle}>
                    {formatDayLabel(group.date, today)}
                  </Text>
                  <Text style={styles.paidDayTotal}>+${group.total}</Text>
                </View>
                {group.items.map((operation) => (
                  <PaidTaskTile
                    key={operation.id}
                    operation={operation}
                    viewer={childId === undefined ? 'parent' : 'child'}
                    approver={findApprover(operation.parentId)}
                    onPress={openCard}
                  />
                ))}
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
                tone={childId === undefined ? 'parent' : 'child'}
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
                  dayOperations.map((operation, index) =>
                    childId === undefined ? (
                      <OperationRow
                        key={operation.id}
                        {...operation}
                        onPress={() => setCard(index)}
                      />
                    ) : (
                      <OperationRow
                        key={operation.id}
                        {...operation}
                        caption="time"
                        leading={<TaskIconBadge size={44} />}
                        onPress={() => setCard(index)}
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

/**
 * История наград ребёнка от его лица: вошедший ребёнок — его профиль с
 * сервера, родитель в режиме ребёнка — Emma.
 */
export function ChildRewardsHistoryPage() {
  const { childId } = useChildAccount();
  return (
    <RewardsHistoryPage childId={childId ?? String(childAccountMock.id)} />
  );
}

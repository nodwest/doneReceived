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
import { PaidTaskCard } from '@widgets/paid-task-card';
import {
  getDayTotals,
  getHistoryDays,
  isSameDay,
  OperationRow,
  useOperations,
  type Operation,
} from '@entities/operation';
import { TaskIconBadge } from '@entities/task';
import { getRewardGoal, useWishes } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { formatMonthDay } from '@shared/lib';
import {
  childAccountMock,
  childProfilesMock,
  childrenMock,
  parentProfilesMock,
} from '@shared/mocks';
import { theme } from '@shared/theme';
import { RoundButton, SnapCarousel } from '@shared/ui';
import { styles } from './rewards-history.styled';

const NO_OPERATIONS: Operation[] = [];

// Кто дал и подтвердил задание; неизвестный — первый родитель.
const findApprover = (id: number) =>
  parentProfilesMock.find((parent) => parent.id === id) ??
  parentProfilesMock[0];

/**
 * История наград по дням (открывается из Wallet и «See all» в профилях):
 * заработанные и упущенные награды на графике, итоги и награды выбранного дня.
 * Тап по награде или кнопка карточек справа в шапке открывают карточки
 * выплаченных заданий этого дня (листаются), кнопка списка или «назад» —
 * обратно к графику на тот же день. С childId — история одного ребёнка от
 * его лица: без фильтра по детям, в голубых тонах, в строках вместо аватара
 * значок задания, в карточке — на сколько награда приблизила желание.
 */
export function RewardsHistoryPage({ childId }: { childId?: number }) {
  const { t } = useTranslation();
  const { data: operations = NO_OPERATIONS, isPending } = useOperations();
  const { data: wishes } = useWishes(childId ?? childAccountMock.id);
  // Сегодня фиксируем на время жизни экрана: от него строится лента дней.
  const [today] = useState(() => new Date());
  // «See all» в профиле ребёнка открывает историю сразу с его фильтром.
  const { child: childParam } = useLocalSearchParams<{ child?: string }>();
  const [selectedChild, setFilter] = useState<ChildFilterValue>(
    () =>
      childrenMock.find((child) => String(child.id) === childParam)?.id ??
      'all',
  );
  const filter = childId ?? selectedChild;
  // null — день не выбран, стоим на сегодняшнем (последнем).
  const [selected, setSelected] = useState<number | null>(null);
  // Номер открытой карточки среди наград дня; null — показан график.
  const [card, setCard] = useState<number | null>(null);

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

  // Копилка ребёнка после каждой награды: нынешний баланс без наград,
  // пришедших позже неё (других движений денег пока нет).
  const goalFor = (operation: Operation) => {
    if (childId === undefined || !wishes) return null;
    const balance =
      childProfilesMock.find((child) => child.id === childId)?.balance ?? 0;
    const later = operations
      .filter(
        (other) =>
          other.child.id === childId &&
          other.kind === 'earned' &&
          other.at > operation.at,
      )
      .reduce((sum, other) => sum + other.amount, 0);
    const after = balance - later;
    return getRewardGoal(wishes, after - operation.amount, after);
  };

  const leave = () =>
    // Назад — туда, откуда пришли (Wallet, профиль); без истории (открыли по
    // ссылке) — в Wallet.
    router.canGoBack() ? router.back() : router.replace('/wallet');

  const title = cards
    ? childId === undefined
      ? t('rewardsHistory.paidTasks')
      : t('rewardsHistory.myRewards')
    : t('rewardsHistory.title');

  return (
    <TabScreen activeKey="wallet" navHidden={cards}>
      <View style={styles.header}>
        <RoundButton
          icon="arrow-left"
          accessibilityLabel={t('common.back')}
          onPress={cards ? () => setCard(null) : leave}
        />
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {cards ? (
          <RoundButton
            icon="list"
            accessibilityLabel={t('tasks.showAsList')}
            onPress={() => setCard(null)}
          />
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
      ) : (
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {childId === undefined ? (
            <View style={styles.filter}>
              <ChildrenFilter
                items={childrenMock}
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

/** История наград ребёнка от его лица (Emma, временный режим ребёнка). */
export const ChildRewardsHistoryPage = () => (
  <RewardsHistoryPage childId={childAccountMock.id} />
);

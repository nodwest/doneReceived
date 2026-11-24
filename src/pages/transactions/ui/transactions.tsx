import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { useCurrentFamily } from '@entities/family';
import { useMemo, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  SectionList,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { useChildAccount } from '@features/family-tasks';
import {
  ChildTransactionCard,
  TransactionCard,
} from '@widgets/transaction-card';
import { TaskIconBadge } from '@entities/task';
import {
  ChildTransactionRow,
  groupByDay,
  TransactionRow,
  useParentTransactionHistory,
  useChildTransactionHistory,
  type ChildTransaction,
  type Transaction,
  type TransactionDay,
} from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { addDays, formatDayHeader, startOfDay } from '@shared/lib';
import { theme, useTheme } from '@shared/theme';
import { Button, RoundButton, SegmentedFilter, SnapCarousel } from '@shared/ui';
import { styles } from './transactions.styled';

const filterEntering = FadeIn.duration(180).reduceMotion(ReduceMotion.System);

type Tone = 'parent' | 'child';

type ScreenProps<T extends { id: string; at: string }, F extends string> = {
  tone: Tone;
  history: {
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    isPageError: boolean;
    invalidCursor: boolean;
    hasNext: boolean;
    oldestAt: string | undefined;
    loadMore: () => void;
    refresh: () => Promise<void>;
  };
  filters: readonly { value: F; label: string }[];
  filter: F;
  onFilter: (value: F) => void;
  /** Транзакции после фильтра, сначала новые. */
  days: TransactionDay<T>[];
  renderRow: (item: T, onPress: () => void) => ReactNode;
  renderCard: (item: T, style: ViewStyle) => ReactNode;
};

/**
 * Экран истории транзакций — общий у родителя и ребёнка: фильтр по типу,
 * транзакции по дням с итогами дня (пришло зелёным, ушло — оранжевым у
 * родителя, синим у ребёнка). Тап по строке открывает транзакции этого дня
 * карточками (листаются, навбара нет), кнопка списка или «назад» — обратно к
 * списку. Кнопка карточек в шапке открывает самый свежий день,
 * `?transaction=<id>` — сразу карточку этой транзакции.
 */
function TransactionsScreen<
  T extends { id: string; at: string },
  F extends string,
>({
  tone,
  history,
  filters,
  filter,
  onFilter,
  days,
  renderRow,
  renderCard,
}: ScreenProps<T, F>) {
  const { t } = useTranslation();
  const { transaction: linkParam } = useLocalSearchParams<{
    transaction?: string;
  }>();
  const [open, setOpen] = useState<string | null>(() => linkParam ?? null);
  const [linked, setLinked] = useState(linkParam !== undefined);
  const [refreshing, setRefreshing] = useState(false);
  const cardsDay = open
    ? days.find((day) => day.items.some((item) => item.id === open))
    : undefined;
  const cards = cardsDay !== undefined;
  const sections = useMemo(
    () =>
      days.map((day) => ({
        ...day,
        key: String(day.date.getTime()),
        data: day.items,
      })),
    [days],
  );
  const refresh = async () => {
    setRefreshing(true);
    try {
      await history.refresh();
    } finally {
      setRefreshing(false);
    }
  };
  const showError = history.isError || history.invalidCursor;
  const incompleteDay =
    history.hasNext && history.oldestAt
      ? startOfDay(new Date(history.oldestAt)).getTime()
      : undefined;
  const retry =
    history.isPageError && !history.invalidCursor ? history.loadMore : refresh;
  const leave = () =>
    router.canGoBack() ? router.back() : router.replace('/wallet');

  return (
    <TabScreen activeKey="wallet" navHidden={cards}>
      <View style={styles.header}>
        <RoundButton
          icon="arrow-left"
          accessibilityLabel={t('common.back')}
          onPress={cards && !linked ? () => setOpen(null) : leave}
        />
        <Text style={styles.title} numberOfLines={1}>
          {t('transactions.title')}
        </Text>
        {cards ? (
          <RoundButton
            icon="list"
            accessibilityLabel={t('tasks.showAsList')}
            onPress={() => {
              setLinked(false);
              setOpen(null);
            }}
          />
        ) : days.length > 0 ? (
          <RoundButton
            icon="cards"
            accessibilityLabel={t('tasks.showAsCards')}
            onPress={() => setOpen(days[0].items[0].id)}
          />
        ) : (
          // Место кнопки держится, чтобы заголовок оставался по центру.
          <View style={styles.headerSpacer} />
        )}
      </View>
      {cards ? (
        <View style={styles.cards}>
          <SnapCarousel
            items={cardsDay.items}
            keyExtractor={(item) => item.id}
            initialIndex={cardsDay.items.findIndex((item) => item.id === open)}
            onIndexChange={(index) =>
              setOpen(cardsDay.items[index]?.id ?? null)
            }
            peek={0}
            gutter={16}
            fill
            dotColor={
              tone === 'child' ? theme.colors.childFrom : theme.colors.parentTo
            }
            renderItem={renderCard}
          />
        </View>
      ) : (
        <>
          <View style={styles.filter}>
            <SegmentedFilter
              options={filters}
              value={filter}
              onChange={(value) => {
                setOpen(null);
                setLinked(false);
                onFilter(value);
              }}
              tone={tone}
            />
          </View>
          <Animated.View
            key={filter}
            entering={filterEntering}
            style={styles.list}
          >
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              style={styles.list}
              contentContainerStyle={styles.body}
              stickySectionHeadersEnabled={false}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (!showError && days.length > 0) history.loadMore();
              }}
              refreshing={refreshing}
              onRefresh={() => void refresh()}
              renderSectionHeader={({ section }) => (
                <View style={styles.dayHead}>
                  <Text style={styles.dayTitle}>
                    {formatDayHeader(section.date)}
                  </Text>
                  {!showError && section.date.getTime() !== incompleteDay && (
                    <View style={styles.totals}>
                      {section.income > 0 && (
                        <Text style={styles.income}>+${section.income}</Text>
                      )}
                      {section.outcome > 0 && (
                        <Text
                          style={[
                            styles.outcome,
                            tone === 'child' && styles.outcomeChild,
                          ]}
                        >
                          −${section.outcome}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              )}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  {renderRow(item, () => {
                    setLinked(false);
                    setOpen(item.id);
                  })}
                </View>
              )}
              ListEmptyComponent={
                !history.isLoading && !showError && !history.hasNext ? (
                  <Text style={styles.empty}>
                    {filter === filters[0].value
                      ? t('transactions.empty')
                      : t('transactions.emptyFilter')}
                  </Text>
                ) : null
              }
              ListFooterComponent={
                history.isFetching ? (
                  <ActivityIndicator accessibilityLabel={t('common.loading')} />
                ) : showError ? (
                  <View>
                    <Text style={styles.empty}>
                      {t('transactions.loadError')}
                    </Text>
                    <Button onPress={() => void retry()}>
                      <Text style={styles.action}>{t('common.retry')}</Text>
                    </Button>
                  </View>
                ) : history.hasNext ? (
                  <Button onPress={history.loadMore}>
                    <Text style={styles.action}>
                      {t('transactions.loadMore')}
                    </Text>
                  </Button>
                ) : null
              }
            />
          </Animated.View>
        </>
      )}
    </TabScreen>
  );
}

// Карточка задания, за которое деньги: открывается в истории наград.
const openTask = (operationId: string) =>
  router.push({
    pathname: '/rewards-history',
    params: { operation: operationId },
  });

type ParentFilter = 'all' | Transaction['kind'];

/**
 * История транзакций родителя (/transactions, «See all» в Wallet): выплаты
 * детям, пополнения и выводы. Карточка выплаты ведёт в карточку задания.
 */
export function TransactionsPage() {
  useTheme();
  const { t } = useTranslation();
  const history = useParentTransactionHistory(useCurrentFamily()?.id ?? null);
  const { transactions } = history;
  const [filter, setFilter] = useState<ParentFilter>('all');
  const days = useMemo(
    () =>
      groupByDay(
        transactions.filter(
          (transaction) => filter === 'all' || transaction.kind === filter,
        ),
      ),
    [transactions, filter],
  );

  return (
    <TransactionsScreen
      tone="parent"
      key={history.key}
      history={history}
      filters={[
        { value: 'all', label: t('transactions.all') },
        { value: 'payout', label: t('transactions.payouts') },
        { value: 'deposit', label: t('transactions.deposits') },
        { value: 'withdrawal', label: t('transactions.withdrawals') },
      ]}
      filter={filter}
      onFilter={setFilter}
      days={days}
      renderRow={(transaction, onPress) => (
        <TransactionRow
          transaction={transaction}
          variant="card"
          caption="time"
          onPress={onPress}
        />
      )}
      renderCard={(transaction, style) => (
        <TransactionCard
          transaction={transaction}
          balanceAfter={transaction.balanceAfter ?? 0}
          onOpenTask={
            transaction.kind === 'payout'
              ? () => openTask(transaction.operationId)
              : undefined
          }
          style={style}
        />
      )}
    />
  );
}

type ChildFilter = 'all' | ChildTransaction['kind'];

/**
 * История транзакций ребёнка (Emma, временный режим ребёнка): награды за
 * задания и выводы на карту. Карточка награды ведёт в карточку задания.
 */
export function ChildTransactionsPage() {
  useTheme();
  const { t } = useTranslation();
  const { familyId, childId } = useChildAccount();
  const history = useChildTransactionHistory(familyId, childId);
  const { transactions, balance } = history;
  const [filter, setFilter] = useState<ChildFilter>('all');
  const [today] = useState(() => startOfDay(new Date()));
  const days = useMemo(
    () =>
      groupByDay(
        transactions.filter(
          (transaction) => filter === 'all' || transaction.kind === filter,
        ),
      ),
    [transactions, filter],
  );
  const from = addDays(today, -6).getTime();
  const oldest = transactions.at(-1);
  const weekComplete =
    !history.invalidCursor &&
    (!history.hasNext || (oldest && Date.parse(oldest.at) < from));
  const weekEarned = useMemo(
    () =>
      weekComplete
        ? transactions.reduce(
            (sum, item) =>
              item.kind === 'reward' && Date.parse(item.at) >= from
                ? sum + item.amount
                : sum,
            0,
          )
        : undefined,
    [transactions, from, weekComplete],
  );
  const balances = useMemo(() => {
    const balances = new Map<string, number>();
    let remaining = balance;
    for (const item of transactions) {
      balances.set(item.id, remaining);
      remaining -= item.kind === 'reward' ? item.amount : -item.amount;
    }
    return balances;
  }, [transactions, balance]);

  return (
    <TransactionsScreen
      tone="child"
      key={history.key}
      history={history}
      filters={[
        { value: 'all', label: t('transactions.all') },
        { value: 'reward', label: t('transactions.rewards') },
        { value: 'withdrawal', label: t('transactions.withdrawals') },
      ]}
      filter={filter}
      onFilter={setFilter}
      days={days}
      renderRow={(transaction, onPress) => (
        <ChildTransactionRow
          transaction={transaction}
          rewardIcon={<TaskIconBadge size={44} />}
          variant="card"
          caption="time"
          onPress={onPress}
        />
      )}
      renderCard={(transaction, style) => (
        <ChildTransactionCard
          transaction={transaction}
          balanceAfter={
            transaction.balanceAfter ?? balances.get(transaction.id) ?? 0
          }
          weekEarned={weekEarned}
          onOpenTask={
            transaction.kind === 'reward' && transaction.operationId !== null
              ? () => openTask(transaction.operationId as string)
              : undefined
          }
          style={style}
        />
      )}
    />
  );
}

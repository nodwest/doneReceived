import { useCurrentFamily } from '@entities/family';
import { useMemo, useState, type ReactNode } from 'react';
import { ScrollView, Text, View, type ViewStyle } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { useMyChildWallet } from '@features/family-tasks';
import {
  ChildTransactionCard,
  TransactionCard,
} from '@widgets/transaction-card';
import { TaskIconBadge } from '@entities/task';
import {
  balanceAfter,
  ChildTransactionRow,
  groupByDay,
  TransactionRow,
  useWallet,
  type ChildTransaction,
  type Transaction,
  type TransactionDay,
} from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import {
  addDays,
  formatDayLabel,
  formatMonthDay,
  formatWeekdayShort,
  startOfDay,
} from '@shared/lib';
import { theme } from '@shared/theme';
import { RoundButton, SegmentedFilter, SnapCarousel } from '@shared/ui';
import { styles } from './transactions.styled';

type Tone = 'parent' | 'child';

type ScreenProps<T extends { id: number; at: string }, F extends string> = {
  tone: Tone;
  isPending: boolean;
  filters: readonly { value: F; label: string }[];
  filter: F;
  onFilter: (value: F) => void;
  /** Транзакции после фильтра, сначала новые. */
  days: TransactionDay<T>[];
  renderRow: (item: T, onPress: () => void) => ReactNode;
  renderCard: (item: T, style: ViewStyle) => ReactNode;
};

// В русском день недели приходит строчным: «сб» → «Сб».
const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

/** «Today, Nov 13», «Yesterday, Nov 12», «Mon, Nov 11». */
function useDayTitle() {
  const { t } = useTranslation();
  return (date: Date) => {
    const today = startOfDay(new Date());
    const recent =
      date.getTime() >= addDays(today, -1).getTime() &&
      date.getTime() <= today.getTime();
    return t('transactions.dayHeader', {
      day: recent ? formatDayLabel(date) : capitalize(formatWeekdayShort(date)),
      date: formatMonthDay(date),
    });
  };
}

/**
 * Экран истории транзакций — общий у родителя и ребёнка: фильтр по типу,
 * транзакции по дням с итогами дня (пришло зелёным, ушло — оранжевым у
 * родителя, синим у ребёнка). Тап по строке открывает транзакции этого дня
 * карточками (листаются, навбара нет), кнопка списка или «назад» — обратно к
 * списку. Кнопка карточек в шапке открывает самый свежий день,
 * `?transaction=<id>` — сразу карточку этой транзакции.
 */
function TransactionsScreen<
  T extends { id: number; at: string },
  F extends string,
>({
  tone,
  isPending,
  filters,
  filter,
  onFilter,
  days,
  renderRow,
  renderCard,
}: ScreenProps<T, F>) {
  const { t } = useTranslation();
  const dayTitle = useDayTitle();
  // Открытые карточки: день и номер транзакции в нём; null — список.
  const [open, setOpen] = useState<{ day: number; index: number } | null>(null);
  // ?transaction=<id> (тап по строке в Wallet) — сразу карточка этой
  // транзакции; «назад» из неё уводит обратно в Wallet.
  const { transaction: linkParam } = useLocalSearchParams<{
    transaction?: string;
  }>();
  const [linked, setLinked] = useState(linkParam !== undefined);
  const [linkPending, setLinkPending] = useState(linkParam !== undefined);
  if (linkPending && !isPending) {
    setLinkPending(false);
    const dayIndex = days.findIndex((day) =>
      day.items.some((item) => String(item.id) === linkParam),
    );
    if (dayIndex >= 0) {
      setOpen({
        day: dayIndex,
        index: days[dayIndex].items.findIndex(
          (item) => String(item.id) === linkParam,
        ),
      });
    } else {
      setLinked(false);
    }
  }
  const cardsDay = open ? days[open.day] : undefined;
  const cards = open !== null && cardsDay !== undefined;
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
            onPress={() => setOpen({ day: 0, index: 0 })}
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
            initialIndex={open.index}
            onIndexChange={(index) => setOpen({ day: open.day, index })}
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
              onChange={onFilter}
              tone={tone}
            />
          </View>
          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            {isPending ? null : days.length === 0 ? (
              <Text style={styles.empty}>
                {filter === filters[0].value
                  ? t('transactions.empty')
                  : t('transactions.emptyFilter')}
              </Text>
            ) : (
              days.map((day, dayIndex) => (
                <View key={day.date.getTime()} style={styles.day}>
                  <View style={styles.dayHead}>
                    <Text style={styles.dayTitle}>{dayTitle(day.date)}</Text>
                    <View style={styles.totals}>
                      {day.income > 0 && (
                        <Text style={styles.income}>+${day.income}</Text>
                      )}
                      {day.outcome > 0 && (
                        <Text
                          style={[
                            styles.outcome,
                            tone === 'child' && styles.outcomeChild,
                          ]}
                        >
                          −${day.outcome}
                        </Text>
                      )}
                    </View>
                  </View>
                  {day.items.map((item, index) => (
                    <View key={item.id}>
                      {renderRow(item, () => setOpen({ day: dayIndex, index }))}
                    </View>
                  ))}
                </View>
              ))
            )}
          </ScrollView>
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
  const { t } = useTranslation();
  const { data: wallet, isPending } = useWallet(useCurrentFamily()?.id ?? null);
  const [filter, setFilter] = useState<ParentFilter>('all');
  const days = useMemo(
    () =>
      groupByDay(
        (wallet?.transactions ?? []).filter(
          (transaction) => filter === 'all' || transaction.kind === filter,
        ),
      ),
    [wallet, filter],
  );

  return (
    <TransactionsScreen
      tone="parent"
      isPending={isPending}
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
          balanceAfter={
            wallet
              ? balanceAfter(wallet.transactions, wallet.balance, transaction)
              : 0
          }
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
  const { t } = useTranslation();
  const { data: wallet, isPending } = useMyChildWallet();
  const [filter, setFilter] = useState<ChildFilter>('all');
  const [today] = useState(() => startOfDay(new Date()));
  const days = useMemo(
    () =>
      groupByDay(
        (wallet?.transactions ?? []).filter(
          (transaction) => filter === 'all' || transaction.kind === filter,
        ),
      ),
    [wallet, filter],
  );
  // Заработано за последние 7 дней вместе с сегодняшним.
  const weekEarned = useMemo(() => {
    const from = addDays(today, -6).toISOString();
    return (wallet?.transactions ?? [])
      .filter((item) => item.kind === 'reward' && item.at >= from)
      .reduce((sum, item) => sum + item.amount, 0);
  }, [wallet, today]);

  return (
    <TransactionsScreen
      tone="child"
      isPending={isPending}
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
            wallet
              ? balanceAfter(wallet.transactions, wallet.balance, transaction)
              : 0
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

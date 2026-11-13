import { Fragment } from 'react';
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { HeroPill, SectionLabel, TaskSheet } from '@entities/task';
import {
  formatBalance,
  formatTransactionTotal,
  transactionCode,
  useChildBalance,
  type ChildTransaction,
  type Transaction,
} from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { formatClock, formatDate, formatMonthDay } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './transaction-card.styled';

type Tone = 'parent' | 'child';

/** «Nov 13, 2026 · 6:12 PM». */
const fullDate = (iso: string) => {
  const date = new Date(iso);
  return `${formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' })} · ${formatClock(date)}`;
};

/** «Nov 13, 5:48 PM» — когда сдано задание. */
const shortDate = (iso: string) => {
  const date = new Date(iso);
  return `${formatMonthDay(date)}, ${formatClock(date)}`;
};

type TaskLinkProps = {
  title: string;
  caption: string;
  tone: Tone;
  onPress?: () => void;
};

/** «For task»: за какое задание деньги; тап открывает его карточку. */
function TaskLink({ title, caption, tone, onPress }: TaskLinkProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.section}>
      <SectionLabel>{t('transactions.forTask')}</SectionLabel>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        disabled={!onPress}
        onPress={onPress}
        style={({ pressed }) => [
          styles.task,
          tone === 'child' && styles.taskChild,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.taskIcon}>
          <Icon
            name="task"
            size={22}
            color={
              tone === 'child' ? theme.colors.childDeep : theme.colors.violet
            }
          />
        </View>
        <View style={styles.taskText}>
          <Text style={styles.taskTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.taskCaption} numberOfLines={1}>
            {caption}
          </Text>
        </View>
        <Icon name="chevron-right" size={16} color={theme.colors.grey} />
      </Pressable>
    </View>
  );
}

/** «Details»: строки «название — значение» с разделителями. */
function Details({ rows }: { rows: [string, string][] }) {
  const { t } = useTranslation();
  return (
    <View style={styles.section}>
      <SectionLabel>{t('transactions.details')}</SectionLabel>
      <View style={styles.details}>
        {rows.map(([key, value], index) => (
          <Fragment key={key}>
            {index > 0 && <View style={styles.divider} />}
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>{key}</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {value}
              </Text>
            </View>
          </Fragment>
        ))}
      </View>
    </View>
  );
}

/** Внизу карточки: баланс после транзакции и пояснение. */
function BalanceNote({
  title,
  caption,
  tone,
}: {
  title: string;
  caption: string;
  tone: Tone;
}) {
  return (
    <View style={styles.note}>
      <View style={[styles.noteIcon, tone === 'child' && styles.noteIconChild]}>
        <Icon name="check" size={16} color={theme.colors.white} />
      </View>
      <View style={styles.noteText}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.noteCaption} numberOfLines={1}>
          {caption}
        </Text>
      </View>
    </View>
  );
}

/** Низ карточки выплаты: баланс после неё и сколько у ребёнка сейчас. */
function PayoutNote({
  title,
  childId,
  name,
}: {
  title: string;
  childId: string;
  name: string;
}) {
  const { t } = useTranslation();
  const { balance } = useChildBalance(childId);
  return (
    <BalanceNote
      tone="parent"
      title={title}
      caption={t('transactions.childBalanceNow', {
        name,
        amount: formatBalance(balance),
      })}
    />
  );
}

type TransactionCardProps = {
  transaction: Transaction;
  /** Баланс кошелька сразу после транзакции. */
  balanceAfter: number;
  /** Открыть карточку задания, за которое выплата. */
  onOpenTask?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Карточка транзакции родителя — тёмно-синяя, как карточка баланса: кому
 * выплата или откуда пополнение, «Completed», крупная сумма; за какое
 * задание (у выплаты), подробности и баланс после неё.
 */
export function TransactionCard({
  transaction,
  balanceAfter,
  onOpenTask,
  style,
}: TransactionCardProps) {
  const { t } = useTranslation();
  const common = {
    tone: 'wallet' as const,
    aside: <HeroPill icon="check" label={t('transactions.completed')} />,
    title: formatTransactionTotal(transaction),
    amount: true,
    style,
  };
  const date: [string, string] = [
    t('transactions.date'),
    fullDate(transaction.at),
  ];
  const id: [string, string] = [
    t('transactions.transactionId'),
    transactionCode(transaction.id),
  ];
  const balance = t('transactions.balanceAfter', {
    amount: formatBalance(balanceAfter),
  });

  if (transaction.kind === 'payout') {
    const { child } = transaction;
    return (
      <TaskSheet
        {...common}
        avatar={child.avatar ?? undefined}
        caption={t('transactions.paidTo')}
        name={child.name}
        footer={
          <PayoutNote title={balance} childId={child.id} name={child.name} />
        }
      >
        <TaskLink
          tone="parent"
          title={transaction.task}
          caption={
            transaction.taskDoneAt
              ? t('transactions.doneBy', {
                  name: child.name,
                  date: shortDate(transaction.taskDoneAt),
                })
              : child.name
          }
          onPress={onOpenTask}
        />
        <Details
          rows={[
            date,
            [t('transactions.from'), t('transactions.yourWallet')],
            [
              t('transactions.to'),
              t('transactions.childBalance', { name: child.name }),
            ],
            [t('transactions.approvedBy'), t('transactions.you')],
            id,
          ]}
        />
      </TaskSheet>
    );
  }

  const deposit = transaction.kind === 'deposit';
  // Без карты (тестовое пополнение) — «Пополнение · кошелька».
  const card = transaction.card
    ? t('transactions.card', { card: transaction.card })
    : t('transactions.walletTopUp');
  return (
    <TaskSheet
      {...common}
      icon="cards"
      caption={
        !transaction.card
          ? t('wallet.deposit')
          : deposit
            ? t('transactions.depositFrom')
            : t('transactions.withdrawalTo')
      }
      name={card}
      footer={
        <BalanceNote
          tone="parent"
          title={balance}
          caption={
            deposit ? t('transactions.availableNow') : t('transactions.arrives')
          }
        />
      }
    >
      <Details
        rows={[
          date,
          [deposit ? t('transactions.method') : t('transactions.to'), card],
          [t('transactions.fee'), formatBalance(0)],
          [
            deposit ? t('transactions.addedBy') : t('transactions.requestedBy'),
            t('transactions.you'),
          ],
          id,
        ]}
      />
    </TaskSheet>
  );
}

type ChildTransactionCardProps = {
  transaction: ChildTransaction;
  balanceAfter: number;
  /** Сколько ребёнок заработал за последние 7 дней (у награды). */
  weekEarned: number;
  onOpenTask?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Карточка транзакции ребёнка — голубая: награда от родителя за задание или
 * вывод на карту; подробности и баланс после.
 */
export function ChildTransactionCard({
  transaction,
  balanceAfter,
  weekEarned,
  onOpenTask,
  style,
}: ChildTransactionCardProps) {
  const { t } = useTranslation();
  const common = {
    tone: 'child' as const,
    aside: <HeroPill icon="check" label={t('transactions.completed')} />,
    title: formatTransactionTotal(transaction),
    amount: true,
    style,
  };
  const date: [string, string] = [
    t('transactions.date'),
    fullDate(transaction.at),
  ];
  const id: [string, string] = [
    t('transactions.transactionId'),
    transactionCode(transaction.id),
  ];
  const balance = t('transactions.balanceAfter', {
    amount: formatBalance(balanceAfter),
  });

  if (transaction.kind === 'reward') {
    const { from } = transaction;
    return (
      <TaskSheet
        {...common}
        avatar={from.avatar ?? undefined}
        caption={t('transactions.rewardFrom')}
        name={from.name}
        footer={
          <BalanceNote
            tone="child"
            title={balance}
            caption={t('transactions.earnedThisWeek', {
              amount: `$${weekEarned}`,
            })}
          />
        }
      >
        <TaskLink
          tone="child"
          title={transaction.task}
          caption={
            transaction.taskDoneAt
              ? t('transactions.doneByYou', {
                  date: shortDate(transaction.taskDoneAt),
                })
              : from.name
          }
          onPress={onOpenTask}
        />
        <Details
          rows={[
            date,
            [t('transactions.from'), t('transactions.familyWallet')],
            [t('transactions.to'), t('transactions.yourBalance')],
            [t('transactions.approvedBy'), from.name],
            id,
          ]}
        />
      </TaskSheet>
    );
  }

  const card = t('transactions.card', { card: transaction.card });
  return (
    <TaskSheet
      {...common}
      icon="cards"
      caption={t('transactions.withdrawalTo')}
      name={card}
      footer={
        <BalanceNote
          tone="child"
          title={balance}
          caption={t('transactions.arrives')}
        />
      }
    >
      <Details
        rows={[
          date,
          [t('transactions.to'), card],
          [t('transactions.fee'), formatBalance(0)],
          [t('transactions.requestedBy'), t('transactions.you')],
          id,
        ]}
      />
    </TaskSheet>
  );
}

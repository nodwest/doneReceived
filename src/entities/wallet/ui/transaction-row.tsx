import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { formatClock, formatDayLabel, startOfDay } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon, LetterAvatar } from '@shared/ui';
import {
  formatTransactionAmount,
  type ChildTransaction,
  type Transaction,
} from '../model/wallet';
import { styles } from './transaction-row.styled';

type RowLook = {
  /** plain — строка внутри общего блока (Wallet), card — своя плашка (весь список). */
  variant?: 'plain' | 'card';
  /**
   * Когда: when — «Today, 6:12 PM» или только день (Wallet), time — только
   * время (список уже разбит по дням).
   */
  caption?: 'when' | 'time';
  onPress?: () => void;
};

function useWhen(at: string, caption: RowLook['caption']) {
  const { t } = useTranslation();
  const date = new Date(at);
  if (caption === 'time') return formatClock(date);
  // Сегодня — «Today, 6:12 PM», раньше — только день: «Yesterday», «Oct 19».
  const day = formatDayLabel(date);
  const isToday =
    startOfDay(date).getTime() === startOfDay(new Date()).getTime();
  return isToday ? t('time.dayAndTime', { day, time: formatClock(date) }) : day;
}

// Выплаты — жёлтые, как выплаченные награды; приход — зелёный; вывод — синий.
const AMOUNT_STYLES = {
  payout: { pill: styles.amountPayout, text: styles.amountTextPayout },
  income: { pill: styles.amountIncome, text: styles.amountTextIncome },
  withdrawal: {
    pill: styles.amountWithdrawal,
    text: styles.amountTextWithdrawal,
  },
};

type RowFrameProps = RowLook & {
  leading: ReactNode;
  title: string;
  subtitle: string;
  amount: string;
  tone: keyof typeof AMOUNT_STYLES;
};

function RowFrame({
  leading,
  title,
  subtitle,
  amount,
  tone,
  variant = 'plain',
  onPress,
}: RowFrameProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={title}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        variant === 'card' && styles.card,
        pressed && styles.pressed,
      ]}
    >
      {leading}
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <View style={[styles.amount, AMOUNT_STYLES[tone].pill]}>
        <Text style={[styles.amountText, AMOUNT_STYLES[tone].text]}>
          {amount}
        </Text>
      </View>
    </Pressable>
  );
}

/** Значок карты: фиолетовый у пополнения, синий у вывода. */
function CardIcon({
  withdrawal,
  large,
}: {
  withdrawal: boolean;
  large: boolean;
}) {
  return (
    <View
      style={[
        styles.icon,
        large && styles.iconLarge,
        withdrawal && styles.iconWithdrawal,
      ]}
    >
      <Icon
        name="cards"
        size={20}
        color={withdrawal ? theme.colors.queueText : theme.colors.violet}
      />
    </View>
  );
}

/**
 * Строка транзакции родителя: выплата ребёнку (аватар, задача, жёлтая сумма)
 * или операция с картой (значок карты; пополнение зелёное, вывод синий).
 */
export function TransactionRow({
  transaction,
  ...look
}: RowLook & { transaction: Transaction }) {
  const { t } = useTranslation();
  const when = useWhen(transaction.at, look.caption);
  const large = look.variant === 'card';

  if (transaction.kind === 'payout') {
    return (
      <RowFrame
        {...look}
        leading={
          <LetterAvatar
            source={transaction.child.avatar}
            name={transaction.child.name}
            style={[styles.avatar, large && styles.avatarLarge]}
          />
        }
        title={t('wallet.paidTo', { name: transaction.child.name })}
        subtitle={`${transaction.task} · ${when}`}
        amount={formatTransactionAmount(transaction)}
        tone="payout"
      />
    );
  }
  const deposit = transaction.kind === 'deposit';
  return (
    <RowFrame
      {...look}
      leading={<CardIcon withdrawal={!deposit} large={large} />}
      title={deposit ? t('wallet.deposit') : t('wallet.withdrawal')}
      subtitle={`${
        deposit
          ? t('wallet.fromCard', { card: transaction.card })
          : t('wallet.toCard', { card: transaction.card })
      } · ${when}`}
      amount={formatTransactionAmount(transaction)}
      tone={deposit ? 'income' : 'withdrawal'}
    />
  );
}

/**
 * Строка транзакции ребёнка: награда за задание (значок задания из пропа
 * rewardIcon, «Reward from Sarah», зелёная сумма) или вывод на карту (синий).
 */
export function ChildTransactionRow({
  transaction,
  rewardIcon,
  ...look
}: RowLook & { transaction: ChildTransaction; rewardIcon: ReactNode }) {
  const { t } = useTranslation();
  const when = useWhen(transaction.at, look.caption);
  const large = look.variant === 'card';

  if (transaction.kind === 'reward') {
    return (
      <RowFrame
        {...look}
        leading={rewardIcon}
        title={transaction.task}
        subtitle={`${
          transaction.from.name
            ? t('transactions.rewardFromName', { name: transaction.from.name })
            : t('transactions.reward')
        } · ${when}`}
        amount={formatTransactionAmount(transaction)}
        tone="income"
      />
    );
  }
  return (
    <RowFrame
      {...look}
      leading={<CardIcon withdrawal large={large} />}
      title={t('wallet.withdrawal')}
      subtitle={`${t('wallet.toCard', { card: transaction.card })} · ${when}`}
      amount={formatTransactionAmount(transaction)}
      tone="withdrawal"
    />
  );
}

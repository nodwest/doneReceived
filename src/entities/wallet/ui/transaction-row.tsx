import { Image, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { formatClock, formatDayLabel, startOfDay } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { formatTransactionAmount, type Transaction } from '../model/wallet';
import { styles } from './transaction-row.styled';

/**
 * Строка транзакции кошелька: выплата ребёнку (аватар, задача, жёлтая сумма)
 * или операция с картой (иконка карты, зелёная сумма у пополнения).
 */
export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const { t } = useTranslation();
  // Сегодня — «Today, 6:12 PM», раньше — только день: «Yesterday», «Oct 19».
  const date = new Date(transaction.at);
  const day = formatDayLabel(date);
  const isToday =
    startOfDay(date).getTime() === startOfDay(new Date()).getTime();
  const when = isToday
    ? t('time.dayAndTime', { day, time: formatClock(date) })
    : day;
  const amount = formatTransactionAmount(transaction);

  const [title, detail] =
    transaction.kind === 'payout'
      ? [t('wallet.paidTo', { name: transaction.child.name }), transaction.task]
      : transaction.kind === 'deposit'
        ? [
            t('wallet.deposit'),
            t('wallet.fromCard', { card: transaction.card }),
          ]
        : [
            t('wallet.withdrawal'),
            t('wallet.toCard', { card: transaction.card }),
          ];

  return (
    <View style={styles.row}>
      {transaction.kind === 'payout' ? (
        <Image source={transaction.child.avatar} style={styles.avatar} />
      ) : (
        <View style={styles.icon}>
          <Icon name="cards" size={20} color={theme.colors.violet} />
        </View>
      )}
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {detail} · {when}
        </Text>
      </View>
      <View style={[styles.amount, AMOUNT_STYLES[transaction.kind].pill]}>
        <Text style={[styles.amountText, AMOUNT_STYLES[transaction.kind].text]}>
          {amount}
        </Text>
      </View>
    </View>
  );
}

// Выплаты — жёлтые, как выплаченные награды в проекте; пополнение — зелёное.
const AMOUNT_STYLES = {
  payout: { pill: styles.amountPayout, text: styles.amountTextPayout },
  deposit: { pill: styles.amountDeposit, text: styles.amountTextDeposit },
  withdrawal: {
    pill: styles.amountWithdrawal,
    text: styles.amountTextWithdrawal,
  },
};

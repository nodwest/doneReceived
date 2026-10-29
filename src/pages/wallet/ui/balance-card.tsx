import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { FamilyRole } from '@entities/user';
import { formatBalance } from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './balance-card.styled';

type BalanceCardProps = {
  balance: number;
  /** parent — тёмно-синяя с Deposit и Withdraw; child — голубая, только Withdraw. */
  role?: FamilyRole;
  /** Сколько ребёнок заработал за неделю: плашка «+$28 this week». */
  weekEarned?: number;
};

const GRADIENTS = {
  parent: [theme.colors.parentTo, theme.colors.parentFrom],
  child: [theme.colors.childFrom, theme.colors.childDeep],
} as const;

/**
 * Карточка баланса на вкладке Wallet: у родителя — кнопки Deposit и Withdraw
 * (ввод и вывод денег), у ребёнка — Withdraw и заработанное за неделю.
 * Кнопки пока ничего не делают.
 */
export function BalanceCard({
  balance,
  role = 'parent',
  weekEarned,
}: BalanceCardProps) {
  const { t } = useTranslation();
  const child = role === 'child';

  return (
    <LinearGradient
      colors={GRADIENTS[role]}
      // Угол 156° из макета, как у карточки на вкладке Profile.
      start={{ x: 0.4, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      locations={[0, 0.7071]}
      style={[styles.card, !child && styles.cardParent]}
    >
      <Text style={[styles.caption, child && styles.captionChild]}>
        {child ? t('wallet.yourBalance') : t('wallet.balance')}
      </Text>
      <Text style={styles.balance}>{formatBalance(balance)}</Text>
      {child && weekEarned !== undefined && (
        <View style={styles.week}>
          <Text style={styles.weekValue}>+${weekEarned}</Text>
          <Text style={styles.weekLabel}>{t('wallet.thisWeek')}</Text>
        </View>
      )}
      <View style={styles.actions}>
        {!child && (
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.button,
              styles.deposit,
              pressed && styles.pressed,
            ]}
          >
            <Icon name="plus" size={16} color={theme.colors.parentFrom} />
            <Text style={[styles.buttonText, styles.depositText]}>
              {t('wallet.depositAction')}
            </Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            styles.withdraw,
            pressed && styles.pressed,
          ]}
        >
          <Icon name="arrow-right" size={16} color={theme.colors.white} />
          <Text style={[styles.buttonText, styles.withdrawText]}>
            {t('wallet.withdrawAction')}
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

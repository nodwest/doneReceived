import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { FamilyRole } from '@entities/user';
import {
  formatBalance,
  formatMoney,
  FundsBar,
  FundsLegendItem,
  getParentFunds,
} from '@entities/wallet';
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
  /**
   * Родитель: сколько из баланса в резерве за ещё не выплаченные задания.
   * Тогда крупно — доступное на новые задания, под ним полоса резерв /
   * доступно от всего кошелька.
   */
  reserved?: number;
};

const GRADIENTS = {
  parent: [theme.colors.parentTo, theme.colors.parentFrom],
  child: [theme.colors.childFrom, theme.colors.childDeep],
} as const;

/**
 * Карточка баланса на вкладке Wallet: у родителя — доступное на задания,
 * полоса «в резерве / доступно» от всего кошелька и кнопки Deposit и
 * Withdraw, у ребёнка — баланс, Withdraw и заработанное за неделю. Кнопки
 * пока ничего не делают.
 */
export function BalanceCard({
  balance,
  role = 'parent',
  weekEarned,
  reserved,
}: BalanceCardProps) {
  const { t } = useTranslation();
  const child = role === 'child';
  const funds =
    !child && reserved !== undefined ? getParentFunds(balance, reserved) : null;

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
        {child
          ? t('wallet.yourBalance')
          : funds
            ? t('wallet.availableForTasks')
            : t('wallet.balance')}
      </Text>
      <Text style={styles.balance}>
        {funds ? formatMoney(funds.available) : formatBalance(balance)}
      </Text>
      {funds && (
        <View style={styles.meter}>
          <FundsBar
            height={10}
            scale={funds.total}
            trackColor={theme.colors.fundsTrackDark}
            segments={[
              {
                key: 'reserved',
                value: funds.reserved,
                color: theme.colors.fundsReservedDark,
              },
              {
                key: 'available',
                value: funds.available,
                color: theme.colors.fundsFreeDark,
              },
            ]}
          />
          <View style={styles.legend}>
            <FundsLegendItem
              color={theme.colors.fundsReservedDark}
              label={t('wallet.reserved')}
              value={formatMoney(funds.reserved)}
              labelColor={theme.colors.heroSubtle}
              valueColor={theme.colors.white}
            />
            <FundsLegendItem
              color={theme.colors.fundsFreeDark}
              label={t('wallet.available')}
              value={formatMoney(funds.available)}
              labelColor={theme.colors.heroSubtle}
              valueColor={theme.colors.white}
            />
            <Text style={styles.total}>
              {t('wallet.ofTotal', { amount: formatMoney(funds.total) })}
            </Text>
          </View>
        </View>
      )}
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

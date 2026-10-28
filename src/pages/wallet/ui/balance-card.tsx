import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatBalance } from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './balance-card.styled';

/**
 * Тёмно-синяя карточка баланса вошедшего родителя с кнопками Deposit и
 * Withdraw (ввод и вывод денег). Кнопки пока ничего не делают.
 */
export function BalanceCard({ balance }: { balance: number }) {
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={[theme.colors.parentTo, theme.colors.parentFrom]}
      // Угол 156° из макета, как у карточки на вкладке Profile.
      start={{ x: 0.4, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      locations={[0, 0.7071]}
      style={styles.card}
    >
      <Text style={styles.caption}>{t('wallet.balance')}</Text>
      <Text style={styles.balance}>{formatBalance(balance)}</Text>
      <View style={styles.actions}>
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

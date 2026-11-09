import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  // Отдельная плашка в полном списке транзакций.
  card: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  pressed: {
    opacity: 0.85,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.violetIcon,
  },
  iconLarge: {
    width: 44,
    height: 44,
  },
  iconWithdrawal: {
    backgroundColor: theme.colors.queueBg,
  },
  middle: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
  amount: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  amountText: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
  },
  amountPayout: {
    backgroundColor: theme.colors.reviewFrom,
  },
  amountTextPayout: {
    color: theme.colors.homeBrown,
  },
  amountIncome: {
    backgroundColor: theme.colors.rewardSoft,
  },
  amountTextIncome: {
    color: theme.colors.earnedLabel,
  },
  amountWithdrawal: {
    backgroundColor: theme.colors.queueBg,
  },
  amountTextWithdrawal: {
    color: theme.colors.queueText,
  },
});

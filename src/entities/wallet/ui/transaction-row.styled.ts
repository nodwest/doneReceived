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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.violetIcon,
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
  amountDeposit: {
    backgroundColor: theme.colors.rewardSoft,
  },
  amountTextDeposit: {
    color: theme.colors.earnedLabel,
  },
  amountWithdrawal: {
    backgroundColor: theme.colors.prime,
  },
  amountTextWithdrawal: {
    color: theme.colors.ink,
  },
});

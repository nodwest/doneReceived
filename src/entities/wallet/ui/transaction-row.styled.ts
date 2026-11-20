import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
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
    borderColor: colors.line,
    backgroundColor: colors.surface,
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
    backgroundColor: colors.violetIcon,
  },
  iconLarge: {
    width: 44,
    height: 44,
  },
  iconWithdrawal: {
    backgroundColor: colors.queueBg,
  },
  middle: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.regular,
    color: colors.grey,
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
    backgroundColor: colors.reviewFrom,
  },
  amountTextPayout: {
    color: colors.homeBrown,
  },
  amountIncome: {
    backgroundColor: colors.rewardSoft,
  },
  amountTextIncome: {
    color: colors.earnedLabel,
  },
  amountWithdrawal: {
    backgroundColor: colors.queueBg,
  },
  amountTextWithdrawal: {
    color: colors.queueText,
  },
}));

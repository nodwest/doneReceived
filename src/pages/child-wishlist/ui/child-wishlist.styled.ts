import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  body: {
    gap: 10,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  balance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  balanceText: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: colors.white,
  },
  list: {
    gap: 8,
  },
  empty: {
    marginVertical: 24,
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  wishBody: {
    gap: 16,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
}));

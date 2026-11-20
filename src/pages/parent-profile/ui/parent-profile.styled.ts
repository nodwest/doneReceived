import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  body: {
    gap: 20,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  list: {
    gap: 6,
  },
  empty: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
}));

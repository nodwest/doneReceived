import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  container: {
    gap: 12,
  },
  placeholder: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  placeholderText: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  error: {
    fontFamily: theme.fonts.semibold,
    color: colors.dangerText,
  },
}));

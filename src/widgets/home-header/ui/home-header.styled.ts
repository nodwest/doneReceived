import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  withSummary: { gap: 6 },
  summary: { flexBasis: 212, flexShrink: 1 },
  compactGreeting: { flex: 1, minWidth: 0 },
  greeting: {
    gap: 4,
  },
  greetingText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  name: {
    fontSize: 26,
    letterSpacing: tracking(26),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  pressed: {
    opacity: 0.8,
  },
}));

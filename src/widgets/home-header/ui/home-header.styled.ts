import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  withSummary: { gap: 6 },
  summary: { flexBasis: 212, flexShrink: 1 },
  compactName: { flex: 1, minWidth: 0 },
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

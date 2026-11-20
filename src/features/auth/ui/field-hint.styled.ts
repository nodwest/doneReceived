import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mark: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.blue,
  },
  dotError: {
    backgroundColor: colors.danger,
  },
  dotMuted: {
    backgroundColor: colors.grey,
  },
  text: {
    flexShrink: 1,
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
  },
  hint: {
    color: colors.blueInk,
  },
  met: {
    color: colors.readyText,
  },
  error: {
    color: colors.danger,
  },
  muted: {
    color: colors.grey,
  },
}));

import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  panel: {
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flexShrink: 1,
    fontSize: 17,
    fontFamily: theme.fonts.bold,
    letterSpacing: tracking(17),
    color: colors.ink,
  },
  hint: {
    fontSize: theme.fontSize.inputName,
    fontFamily: theme.fonts.medium,
    letterSpacing: tracking(theme.fontSize.inputName),
    color: colors.grey,
  },
}));

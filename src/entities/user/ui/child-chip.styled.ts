import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 18,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.violet,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  initial: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.childChip,
  },
  letter: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: colors.childInk,
  },
  name: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
}));

import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  // Плашка «вернули на переделку»: коралловая, без тревожного красного.
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.sentBackBorder,
    backgroundColor: colors.sentBackBg,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  text: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    alignSelf: 'stretch',
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: colors.sentBack,
  },
  chip: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.sentBackChip,
  },
  chipText: {
    fontSize: 12,
    letterSpacing: tracking(12),
    fontFamily: theme.fonts.semibold,
    color: colors.sentBackChipText,
  },
  comment: {
    alignSelf: 'stretch',
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.regular,
    color: colors.ink,
  },
}));

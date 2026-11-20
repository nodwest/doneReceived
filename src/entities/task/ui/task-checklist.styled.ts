import { withAlpha } from '@shared/lib';
import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  progress: {
    marginLeft: 'auto',
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: colors.earnedDark,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: withAlpha(colors.earned, 0.14),
  },
  bar: {
    height: 6,
    borderRadius: 3,
  },

  list: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.checklistLine,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.checklistLine,
  },
  // Сделанный шаг: бледно-зелёная подложка, чтобы отделялся, но не пестрил.
  stepDone: {
    backgroundColor: withAlpha(colors.earned, 0.09),
  },
  pressed: {
    opacity: 0.7,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxEmpty: {
    borderWidth: 1.5,
    borderColor: colors.checklistHandle,
    backgroundColor: colors.surface,
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.medium,
    color: colors.ink,
  },
  hint: {
    fontSize: theme.fontSize.xs,
    lineHeight: 16,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
}));

import { StyleSheet } from 'react-native';
import { withAlpha } from '@shared/lib';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  progress: {
    marginLeft: 'auto',
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.earnedDark,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: withAlpha(theme.colors.earned, 0.14),
  },
  bar: {
    height: 6,
    borderRadius: 3,
  },

  list: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.checklistLine,
    backgroundColor: theme.colors.white,
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
    borderTopColor: theme.colors.checklistLine,
  },
  // Сделанный шаг: бледно-зелёная подложка, чтобы отделялся, но не пестрил.
  stepDone: {
    backgroundColor: withAlpha(theme.colors.earned, 0.09),
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
    borderColor: theme.colors.checklistHandle,
    backgroundColor: theme.colors.white,
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
  },
  hint: {
    fontSize: theme.fontSize.xs,
    lineHeight: 16,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});

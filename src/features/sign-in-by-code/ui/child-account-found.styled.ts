import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.approvedBorder,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.white,
  },
  initial: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.violetSoft,
  },
  initialText: {
    fontSize: 18,
    letterSpacing: tracking(18),
    fontFamily: theme.fonts.bold,
    color: colors.violetInk,
  },
  text: {
    flex: 1,
    gap: 3,
  },
  greeting: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  account: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: colors.rewardText,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
  },
}));

import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.85,
  },
  plain: {
    paddingHorizontal: 12,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  middle: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.regular,
    color: colors.grey,
  },
  reward: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: colors.rewardSoft,
  },
  rewardText: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: colors.rewardText,
  },
  rewardMissed: {
    backgroundColor: colors.missedSoft,
  },
  rewardTextMissed: {
    color: colors.missedDeep,
  },
}));

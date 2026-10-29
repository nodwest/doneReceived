import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)',
  },
  pending: {
    borderColor: theme.colors.reviewBorder,
  },
  approved: {
    borderColor: theme.colors.approvedBorder,
  },
  new: {
    overflow: 'hidden',
    borderColor: theme.colors.childTintBorder,
    backgroundColor: theme.colors.white,
  },
  fill: {
    ...StyleSheet.absoluteFill,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  middle: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  subtitleApproved: {
    color: theme.colors.success,
  },
  subtitleNew: {
    color: theme.colors.childDeep,
  },
  reward: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: theme.colors.yellow,
  },
  rewardPending: {
    color: theme.colors.reviewAccent,
  },
  rewardNew: {
    color: theme.colors.childDeep,
  },
});

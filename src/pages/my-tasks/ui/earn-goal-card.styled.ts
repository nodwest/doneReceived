import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    gap: 14,
    padding: 16,
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0px 10px 24px rgba(31, 94, 184, 0.22)',
  },
  top: {
    gap: 2,
  },
  label: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  amount: {
    fontSize: 34,
    letterSpacing: tracking(34),
    fontFamily: theme.fonts.extrabold,
    color: theme.colors.white,
  },
  forTasks: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  goal: {
    gap: 8,
  },
  goalHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalTitle: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  nums: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  numsStrong: {
    fontFamily: theme.fonts.extrabold,
    color: theme.colors.white,
  },
  track: {
    height: 10,
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  saved: {
    height: '100%',
    backgroundColor: theme.colors.white,
  },
  fromTasks: {
    height: '100%',
  },
  caption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  captionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.goalDot,
  },
  captionText: {
    flex: 1,
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

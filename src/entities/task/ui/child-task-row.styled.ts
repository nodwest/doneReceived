import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    gap: 12,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  rowActive: {
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.06)',
  },
  rowReview: {
    borderColor: theme.colors.reviewBorder,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
  pressed: {
    opacity: 0.85,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  aside: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.childDeep,
    fontVariant: ['tabular-nums'],
  },
  asideReview: {
    color: theme.colors.reviewText,
  },
  description: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    lineHeight: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.inkSoft,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  chip: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.childChip,
  },
  chipReview: {
    backgroundColor: theme.colors.white,
  },
  chipText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: theme.colors.childDeep,
  },
  chipTextReview: {
    color: theme.colors.reviewText,
  },
  reward: {
    fontSize: 17,
    letterSpacing: tracking(17),
    fontFamily: theme.fonts.bold,
    color: theme.colors.yellow,
  },
  waiting: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  waitingText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.reviewText,
  },
});

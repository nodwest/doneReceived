import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    height: 114,
    flexDirection: 'row',
    alignItems: 'center',
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
  assignee: {
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
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
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  aside: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fonts.medium,
    color: theme.colors.violet,
    fontVariant: ['tabular-nums'],
  },
  asideReview: {
    color: theme.colors.reviewText,
  },
  description: {
    fontSize: theme.fontSize.xs,
    lineHeight: 16,
    fontFamily: theme.fonts.medium,
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
    backgroundColor: theme.colors.violetChip,
  },
  chipReview: {
    backgroundColor: theme.colors.white,
  },
  chipText: {
    fontSize: 11,
    fontFamily: theme.fonts.bold,
    color: theme.colors.violet,
  },
  chipTextReview: {
    color: theme.colors.reviewText,
  },
  reward: {
    fontSize: 17,
    fontFamily: theme.fonts.bold,
    color: theme.colors.yellow,
  },
});

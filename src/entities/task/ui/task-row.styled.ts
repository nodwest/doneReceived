import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    gap: 10,
    padding: 16,
    borderRadius: 24,
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
  meta: {
    gap: 4,
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
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: theme.colors.violet,
  },
  chipTextReview: {
    color: theme.colors.reviewText,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: 4,
  },
});

import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    gap: 10,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  rowActive: {
    borderColor: theme.colors.line,
  },
  rowReview: {
    borderColor: theme.colors.reviewBorder,
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
    backgroundColor: theme.colors.reviewChipBg,
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

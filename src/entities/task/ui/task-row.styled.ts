import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  row: {
    gap: 10,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  rowActive: {
    borderColor: colors.line,
  },
  rowReview: {
    borderColor: colors.reviewBorder,
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
    backgroundColor: colors.violetChip,
  },
  chipReview: {
    backgroundColor: colors.reviewChipBg,
  },
  chipText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: colors.violetInk,
  },
  chipTextReview: {
    color: colors.reviewText,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: 4,
  },
}));

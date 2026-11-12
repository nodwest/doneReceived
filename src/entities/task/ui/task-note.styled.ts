import { StyleSheet } from 'react-native';
import { withAlpha } from '@shared/lib';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  // Пузырь комментария: острый верхний левый угол — как сообщение.
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bubbleReview: {
    backgroundColor: theme.colors.noteReviewBg,
    borderColor: withAlpha(theme.colors.reviewDot, 0.35),
  },
  bubblePaid: {
    backgroundColor: withAlpha(theme.colors.earned, 0.09),
    borderColor: withAlpha(theme.colors.earned, 0.3),
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.regular,
    color: theme.colors.ink,
  },

  optional: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
    backgroundColor: theme.colors.line,
  },
  optionalText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.grey,
  },
  field: {
    gap: 10,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.checklistLine,
    backgroundColor: theme.colors.white,
  },
  fieldFocused: {
    borderColor: withAlpha(theme.colors.childFrom, 0.6),
  },
  input: {
    minHeight: 44,
    padding: 0,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.regular,
    color: theme.colors.ink,
    textAlignVertical: 'top',
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  hint: {
    fontSize: theme.fontSize.xs,
    lineHeight: 16,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});

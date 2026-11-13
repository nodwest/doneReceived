import {
  Platform,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
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
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.checklistLine,
    backgroundColor: theme.colors.white,
    // На вебе над всем полем — текстовый курсор, как над самим текстом.
    ...Platform.select<ViewStyle>({
      web: { cursor: 'text' } as unknown as ViewStyle,
    }),
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
    // Браузерную рамку фокуса и ручку ресайза на вебе убираем.
    ...Platform.select<TextStyle>({
      web: { outlineStyle: 'none', resize: 'none' } as unknown as TextStyle,
    }),
  },
  // Зеркало текста для замера высоты: невидимое, поверх поля.
  mirror: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: 0,
    opacity: 0,
  },
  // Счётчик — плашка в правом нижнем углу, по центру последней строки
  // (строка 22, плашка 18: снизу паддинг поля 12 + 2).
  counter: {
    position: 'absolute',
    right: 16,
    bottom: 14,
    height: 18,
    justifyContent: 'center',
    paddingHorizontal: 7,
    borderRadius: 6,
    backgroundColor: theme.colors.prime,
  },
  counterText: {
    fontSize: 11,
    lineHeight: 14,
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

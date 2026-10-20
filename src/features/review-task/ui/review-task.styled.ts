import { Platform, StyleSheet, type TextStyle } from 'react-native';
import { theme } from '@shared/theme';

// Убирает браузерную рамку фокуса и ручку ресайза; в типах RN этих значений нет.
const webInputReset = Platform.select({
  web: { outlineWidth: 0, outlineStyle: 'none', resize: 'none' },
}) as unknown as TextStyle;

export const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  // Кнопки проверки в футере экрана занимают всю его ширину.
  reviewActions: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },

  body: {
    gap: 16,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
    textAlign: 'center',
  },

  reasons: {
    gap: 8,
  },
  // Выбранная причина с рамкой 2pt: отступы меньше на 1pt, чтобы высота не прыгала.
  reason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  reasonSelected: {
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: theme.colors.violet,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: theme.colors.violet,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.violet,
  },
  reasonLabel: {
    fontSize: 15,
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
  },
  reasonLabelSelected: {
    fontFamily: theme.fonts.bold,
  },

  field: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: theme.fontSize.inputName,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  optional: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  comment: {
    minHeight: 68,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
    textAlignVertical: 'top',
    ...webInputReset,
  },
});

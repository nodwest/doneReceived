import { Platform, StyleSheet, type TextStyle } from 'react-native';
import { theme } from '@shared/theme';

// Убирает браузерную рамку фокуса и ручку ресайза; в типах RN этих значений нет.
const webInputReset = Platform.select({
  web: { outlineWidth: 0, outlineStyle: 'none', resize: 'none' },
}) as unknown as TextStyle;

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    gap: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  footer: {
    paddingTop: 12,
    backgroundColor: theme.colors.prime,
  },

  field: {
    gap: 10,
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

  input: {
    height: 56,
    paddingVertical: 0,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
    boxShadow: 'none',
  },
  // Рамка и отступы на обёртке, чтобы высота TextInput равнялась высоте текста.
  textareaBox: {
    minHeight: 88,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  textareaInput: {
    minHeight: 56,
    padding: 0,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
    textAlignVertical: 'top',
    ...webInputReset,
  },

  textareaMirror: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    minHeight: 0,
    opacity: 0,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  chipSelected: {
    borderColor: theme.colors.violet,
    backgroundColor: theme.colors.violet,
  },
  chipText: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.bold,
    color: theme.colors.grey,
  },
  chipTextSelected: {
    color: theme.colors.white,
  },

  reward: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.yellow,
    overflow: 'hidden',
  },
  rewardSign: {
    fontSize: 32,
    fontFamily: theme.fonts.bold,
    color: theme.colors.yellow,
  },
  rewardInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
    fontSize: 44,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
    ...webInputReset,
  },
  rewardInputCompact: {
    fontSize: 36,
  },

  deadlineBox: {
    gap: 8,
  },
  deadlineHint: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  deadlineError: {
    color: theme.colors.danger,
  },
  dateButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  dateButtonText: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  dateInputWeb: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.colors.line,
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
});

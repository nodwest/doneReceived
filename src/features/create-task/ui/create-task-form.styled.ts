import { Platform, StyleSheet, type TextStyle } from 'react-native';
import { theme, tracking } from '@shared/theme';

// Убирает браузерную рамку фокуса и ручку ресайза; в типах RN этих значений нет.
const webInputReset = Platform.select({
  web: { outlineWidth: 0, outlineStyle: 'none', resize: 'none' },
}) as unknown as TextStyle;

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    // Растягиваем контент на весь экран: короткая форма прижимает кнопку ко дну.
    flexGrow: 1,
    gap: 24,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 24,
  },
  footer: {
    // Автоотступ толкает кнопку вниз; если контента много, она остаётся в конце потока.
    marginTop: 'auto',
    paddingTop: 8,
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
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  optional: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
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
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
    boxShadow: 'none',
  },
  // Рамка и отступы на обёртке, чтобы высота TextInput равнялась высоте текста.
  textareaBox: {
    minHeight: 88,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  textareaInput: {
    minHeight: 56,
    padding: 0,
    fontSize: 15,
    letterSpacing: tracking(15),
    lineHeight: 20,
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
    textAlignVertical: 'top',
    ...webInputReset,
  },

  textareaMirror: {
    position: 'absolute',
    top: 16,
    left: 18,
    right: 18,
    minHeight: 0,
    opacity: 0,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chipRowCompact: {
    gap: 8,
  },
  chip: {
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    letterSpacing: tracking(theme.fontSize.sm),
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
    letterSpacing: tracking(32),
    fontFamily: theme.fonts.bold,
    color: theme.colors.yellow,
  },
  rewardInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
    fontSize: 44,
    letterSpacing: tracking(44),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
    ...webInputReset,
  },
  rewardInputCompact: {
    fontSize: 36,
    letterSpacing: tracking(36),
  },

  deadlineHint: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  deadlineError: {
    color: theme.colors.danger,
  },
  deadlineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  dateButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.violet,
    backgroundColor: theme.colors.white,
  },
  dateButtonInvalid: {
    borderColor: theme.colors.danger,
  },
  dateButtonText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.bold,
    color: theme.colors.violet,
  },
});

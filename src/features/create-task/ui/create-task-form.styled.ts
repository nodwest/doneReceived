import { Platform, type TextStyle } from 'react-native';
import { createStyles, theme, tracking } from '@shared/theme';

// Убирает браузерную рамку фокуса и ручку ресайза; в типах RN этих значений нет.
const webInputReset = Platform.select({
  web: { outlineWidth: 0, outlineStyle: 'none', resize: 'none' },
}) as unknown as TextStyle;

export const styles = createStyles((colors) => ({
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
    color: colors.ink,
  },
  optional: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },

  input: {
    height: 56,
    paddingVertical: 0,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: colors.ink,
    boxShadow: 'none',
  },
  // Рамка и отступы на обёртке, чтобы высота TextInput равнялась высоте текста.
  textareaBox: {
    minHeight: 88,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  textareaInput: {
    minHeight: 56,
    padding: 0,
    fontSize: 15,
    letterSpacing: tracking(15),
    lineHeight: 20,
    fontFamily: theme.fonts.medium,
    color: colors.ink,
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
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.violet,
    backgroundColor: colors.violet,
  },
  chipText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: colors.grey,
  },
  chipTextSelected: {
    color: colors.white,
  },

  reward: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.yellow,
    overflow: 'hidden',
  },
  rewardError: {
    borderColor: colors.dangerText,
  },
  rewardSign: {
    fontSize: 32,
    letterSpacing: tracking(32),
    fontFamily: theme.fonts.bold,
    color: colors.yellow,
  },
  rewardSignError: {
    color: colors.dangerText,
  },
  rewardInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
    fontSize: 44,
    letterSpacing: tracking(44),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
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
    color: colors.grey,
  },
  deadlineError: {
    color: colors.danger,
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
    borderColor: colors.violet,
    backgroundColor: colors.surface,
  },
  dateButtonInvalid: {
    borderColor: colors.danger,
  },
  dateButtonText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.bold,
    color: colors.violetInk,
  },
}));

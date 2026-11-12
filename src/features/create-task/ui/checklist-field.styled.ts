import { Platform, StyleSheet, type TextStyle } from 'react-native';
import { theme, tracking } from '@shared/theme';

// Убирает браузерную рамку фокуса; в типах RN этих значений нет.
const webInputReset = Platform.select({
  web: { outlineWidth: 0, outlineStyle: 'none' },
}) as unknown as TextStyle;

export const styles = StyleSheet.create({
  // Свёрнуто: пунктирная кнопка Add checklist.
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.checklistBorder,
    backgroundColor: theme.colors.white,
  },
  addText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  addTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.violet,
  },
  addSubtitle: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  pressed: {
    opacity: 0.7,
  },

  // Развёрнуто: подпись с числом шагов, список, подсказка.
  field: {
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  count: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  editor: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingLeft: 10,
    paddingRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  stepLifted: {
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
  stepDraft: {
    backgroundColor: theme.colors.checklistDraftBg,
  },
  handle: {
    width: 12,
    height: 18,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: theme.colors.placeholder,
  },
  checkboxDraft: {
    borderStyle: 'dashed',
    borderColor: theme.colors.violet,
  },
  stepInput: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
    ...webInputReset,
  },
  enterHint: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.medium,
    color: theme.colors.violet,
  },
  addStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  addStepText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.violet,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintText: {
    flex: 1,
    minWidth: 0,
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});

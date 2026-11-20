import { Platform, type TextStyle, type ViewStyle } from 'react-native';
import { createStyles, theme, tracking } from '@shared/theme';

// Убирает браузерную рамку фокуса; в типах RN этих значений нет.
const webInputReset = Platform.select({
  web: { outlineWidth: 0, outlineStyle: 'none' },
}) as unknown as TextStyle;

// Кнопкам — без браузерной рамки фокуса.
const webNoOutline = Platform.select({
  web: { outlineWidth: 0, outlineStyle: 'none' },
}) as unknown as ViewStyle;

export const styles = createStyles((colors) => ({
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
    borderColor: colors.checklistBorder,
    backgroundColor: colors.surface,
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
    color: colors.violetInk,
  },
  addSubtitle: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
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
    color: colors.grey,
  },
  editor: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
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
    borderBottomColor: colors.line,
    backgroundColor: colors.surface,
  },
  stepLifted: {
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
  stepDraft: {
    backgroundColor: colors.checklistDraftBg,
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
    borderColor: colors.placeholder,
  },
  checkboxDraft: {
    borderStyle: 'dashed',
    borderColor: colors.violet,
  },
  stepInput: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.medium,
    color: colors.ink,
    ...webInputReset,
  },
  enterHint: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.medium,
    color: colors.violetInk,
  },
  addStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 14,
    // Браузерную рамку фокуса не рисуем.
    ...webNoOutline,
  },
  addStepText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: colors.violetInk,
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
    color: colors.grey,
  },
}));

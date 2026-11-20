import { withAlpha } from '@shared/lib';
import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  // Кнопки проверки занимают всю ширину низа карточки.
  reviewActions: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },

  body: {
    gap: 16,
    paddingTop: 6,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    letterSpacing: tracking(22),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  close: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.closeBg,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: tracking(14),
    fontFamily: theme.fonts.regular,
    color: colors.inkSoft,
  },

  reasons: {
    gap: 8,
  },
  // Выбранная причина с рамкой 1.5pt: отступы меньше на 0.5pt, чтобы высота
  // не прыгала.
  reason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  reasonSelected: {
    paddingVertical: 12.5,
    paddingHorizontal: 15.5,
    borderWidth: 1.5,
    borderColor: colors.violet,
    backgroundColor: withAlpha(colors.violet, 0.06),
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.sheetGrabber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.violet,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.violet,
  },
  reasonLabel: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.medium,
    color: colors.ink,
  },
  reasonLabelSelected: {
    fontFamily: theme.fonts.semibold,
  },

  required: {
    color: colors.violetInk,
  },

  // Плашка «Let Emma redo it»: включено — фиолетовая, выключено — серая,
  // срок прошёл — тёплая.
  redo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  redoOn: {
    borderColor: withAlpha(colors.violet, 0.2),
  },
  redoOff: {
    borderColor: colors.line,
    backgroundColor: colors.prime,
  },
  redoExpired: {
    borderColor: withAlpha(colors.reviewDot, 0.3),
    backgroundColor: colors.noteReviewBg,
  },
  redoInfo: {
    flex: 1,
    gap: 2,
  },
  redoTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  redoTitleExpired: {
    color: colors.heroReviewCaption,
  },
  redoHint: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: tracking(12),
    fontFamily: theme.fonts.regular,
    color: colors.inkSoft,
  },

  submit: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitRetry: {
    boxShadow: `0px 6px 16px ${withAlpha(colors.violet, 0.25)}`,
  },
  submitClose: {
    boxShadow: `0px 6px 16px ${withAlpha(colors.danger, 0.22)}`,
  },
  submitDisabled: {
    backgroundColor: colors.line,
  },
  pressed: {
    opacity: 0.85,
  },
  submitLabel: {
    flexShrink: 1,
    fontSize: 16,
    letterSpacing: tracking(16),
    fontFamily: theme.fonts.semibold,
    color: colors.white,
  },
  submitLabelDisabled: {
    color: colors.placeholderSoft,
  },
}));

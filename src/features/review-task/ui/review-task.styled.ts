import { StyleSheet } from 'react-native';
import { withAlpha } from '@shared/lib';
import { theme, tracking } from '@shared/theme';

const RADIO_BORDER = '#D9DBE3';
const SUBMIT_DISABLED = '#E9EAF0';

export const styles = StyleSheet.create({
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
    color: theme.colors.ink,
  },
  close: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: theme.colors.closeBg,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: tracking(14),
    fontFamily: theme.fonts.regular,
    color: theme.colors.inkSoft,
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
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  reasonSelected: {
    paddingVertical: 12.5,
    paddingHorizontal: 15.5,
    borderWidth: 1.5,
    borderColor: theme.colors.violet,
    backgroundColor: withAlpha(theme.colors.violet, 0.06),
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: RADIO_BORDER,
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
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
  },
  reasonLabelSelected: {
    fontFamily: theme.fonts.semibold,
  },

  required: {
    color: theme.colors.violet,
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
    borderColor: withAlpha(theme.colors.violet, 0.2),
  },
  redoOff: {
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.prime,
  },
  redoExpired: {
    borderColor: withAlpha(theme.colors.reviewDot, 0.3),
    backgroundColor: theme.colors.noteReviewBg,
  },
  redoInfo: {
    flex: 1,
    gap: 2,
  },
  redoTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  redoTitleExpired: {
    color: theme.colors.heroReviewCaption,
  },
  redoHint: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: tracking(12),
    fontFamily: theme.fonts.regular,
    color: theme.colors.inkSoft,
  },

  submit: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitRetry: {
    boxShadow: `0px 6px 16px ${withAlpha(theme.colors.violet, 0.25)}`,
  },
  submitClose: {
    boxShadow: `0px 6px 16px ${withAlpha(theme.colors.danger, 0.22)}`,
  },
  submitDisabled: {
    backgroundColor: SUBMIT_DISABLED,
  },
  pressed: {
    opacity: 0.85,
  },
  submitLabel: {
    flexShrink: 1,
    fontSize: 16,
    letterSpacing: tracking(16),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.white,
  },
  submitLabelDisabled: {
    color: theme.colors.placeholderSoft,
  },
});

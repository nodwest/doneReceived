import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  // Почта в подзаголовке: тёмная и жирнее, чтобы сразу заметить опечатку.
  email: {
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  error: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.danger,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  hint: {
    flexShrink: 1,
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.regular,
    color: colors.grey,
  },
  resend: {
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.6,
  },
  resendLink: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.semibold,
    color: colors.violetInk,
  },
  // Пока идёт отсчёт: надпись серая, время фиолетовое.
  resendWaiting: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.semibold,
    color: colors.grey,
  },
  timer: {
    color: colors.violetInk,
  },
}));

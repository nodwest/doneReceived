import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  // Почта в подзаголовке: тёмная и жирнее, чтобы сразу заметить опечатку.
  email: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  error: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.danger,
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
    color: theme.colors.grey,
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
    color: theme.colors.violet,
  },
  // Пока идёт отсчёт: надпись серая, время фиолетовое.
  resendWaiting: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.grey,
  },
  timer: {
    color: theme.colors.violet,
  },
});

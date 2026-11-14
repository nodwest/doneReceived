import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.fontSize.lg,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  headerSpacer: {
    width: 44,
  },
  body: {
    flexGrow: 1,
    gap: 24,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  intro: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    lineHeight: 20,
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
  // Почта в тексте: тёмная и жирнее, чтобы сразу заметить опечатку.
  email: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  form: {
    gap: 16,
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
  // Прижимает кнопки к низу, когда форма короче экрана.
  footer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    gap: 16,
  },
  another: {
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
});

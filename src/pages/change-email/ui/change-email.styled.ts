import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
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
    color: colors.ink,
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
  // Ввод кода: шапка ближе к иконке, как в макете «Confirm Email».
  bodyHero: {
    paddingTop: 4,
  },
  hero: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 12,
  },
  heroIcon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 16px rgba(108, 92, 231, 0.25)',
  },
  heroTitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.h1,
    letterSpacing: tracking(theme.fontSize.h1),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  heroSubtitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    lineHeight: 18,
    fontFamily: theme.fonts.regular,
    color: colors.grey,
  },
  intro: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    lineHeight: 20,
    fontFamily: theme.fonts.regular,
    color: colors.grey,
  },
  // Почта в тексте: тёмная и жирнее, чтобы сразу заметить опечатку.
  email: {
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
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
    color: colors.grey,
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
  // Прижимает кнопки к низу, когда форма короче экрана.
  footer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    gap: 16,
  },
  // «Wrong address? Change email» внизу экрана кода.
  footnote: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  footnoteText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    lineHeight: 18,
    fontFamily: theme.fonts.regular,
    color: colors.grey,
  },
  footnoteLink: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    lineHeight: 18,
    fontFamily: theme.fonts.bold,
    color: colors.violetInk,
  },
}));

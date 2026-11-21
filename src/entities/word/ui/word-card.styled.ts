import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  card: {
    gap: 20,
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    boxShadow: '0px 8px 24px rgba(30, 95, 184, 0.10)',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rank: {
    fontSize: theme.fontSize.xs,
    lineHeight: 16,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.regular,
    color: colors.grey,
  },
  // Ранг, слово, транскрипция и формы — с воздухом между строками.
  wordBlock: {
    flex: 1,
    gap: 8,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  word: {
    flex: 1,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: tracking(36),
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  transcription: {
    fontSize: theme.fontSize.md,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  forms: {
    fontSize: theme.fontSize.sm,
    lineHeight: 18,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
  collocations: {
    gap: 6,
  },
  collocation: {
    fontSize: theme.fontSize.md,
    lineHeight: 22,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
  collocationEn: {
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  // Пример шире остального: от краёв карточки — 10 вместо 20.
  example: {
    marginHorizontal: -10,
    gap: 8,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.childTintLight,
    borderWidth: 1,
    borderColor: colors.childTintBorder,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exampleText: {
    flex: 1,
    fontSize: theme.fontSize.lg,
    lineHeight: 24,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  exampleHighlight: {
    fontFamily: theme.fonts.extrabold,
    color: colors.childInk,
  },
  exampleTranslation: {
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
  translationBlock: {
    gap: 4,
  },
  label: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: colors.grey,
    textTransform: 'uppercase',
  },
  // Перевод — того же цвета, что слово, чуть мельче него.
  translation: {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: tracking(32),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  hiddenTranslation: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: colors.grey,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
}));

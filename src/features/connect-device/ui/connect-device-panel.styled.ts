import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  panel: {
    gap: 10,
  },
  instruction: {
    fontSize: theme.fontSize.inputName,
    lineHeight: 18,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.regular,
    color: colors.inkSoft,
  },
  codeBox: {
    minHeight: 67,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.violet,
    backgroundColor: colors.surface,
  },
  codeBoxExpired: {
    borderColor: colors.line,
  },
  code: {
    fontSize: 30,
    // Код читают вслух и переписывают: символы пошире.
    letterSpacing: 2,
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  codeExpired: {
    color: colors.placeholderSoft,
  },
  copy: {
    position: 'absolute',
    right: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timer: {
    flex: 1,
    minHeight: 39,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 9,
    paddingRight: 10,
  },
  validFor: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
  left: {
    fontSize: 17,
    letterSpacing: tracking(17),
    fontFamily: theme.fonts.bold,
    color: colors.violetInk,
    fontVariant: ['tabular-nums'],
  },
  expired: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.semibold,
    color: colors.dangerText,
  },
  newCode: {
    height: 39,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 30,
    borderRadius: 12,
    backgroundColor: colors.violetSoft,
  },
  newCodeLabel: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: colors.violetInk,
  },
  footnote: {
    fontSize: theme.fontSize.xs,
    lineHeight: 16,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.regular,
    color: colors.grey,
  },
  pressed: {
    opacity: 0.7,
  },
}));

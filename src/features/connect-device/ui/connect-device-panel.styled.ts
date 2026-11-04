import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  panel: {
    gap: 10,
  },
  instruction: {
    fontSize: theme.fontSize.inputName,
    lineHeight: 18,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.regular,
    color: theme.colors.inkSoft,
  },
  codeBox: {
    minHeight: 67,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.violet,
    backgroundColor: theme.colors.white,
  },
  codeBoxExpired: {
    borderColor: theme.colors.line,
  },
  code: {
    fontSize: 30,
    // Код читают вслух и переписывают: символы пошире.
    letterSpacing: 2,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  codeExpired: {
    color: theme.colors.placeholderSoft,
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
    color: theme.colors.inkSoft,
  },
  left: {
    fontSize: 17,
    letterSpacing: tracking(17),
    fontFamily: theme.fonts.bold,
    color: theme.colors.violet,
    fontVariant: ['tabular-nums'],
  },
  expired: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.dangerText,
  },
  newCode: {
    height: 39,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 30,
    borderRadius: 12,
    backgroundColor: theme.colors.violetSoft,
  },
  newCodeLabel: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.violet,
  },
  footnote: {
    fontSize: theme.fontSize.xs,
    lineHeight: 16,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
  pressed: {
    opacity: 0.7,
  },
});

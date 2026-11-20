import { Platform, type TextStyle } from 'react-native';
import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  options: {
    gap: 16,
  },
  card: {
    gap: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  cardSelected: {
    borderColor: colors.violet,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  cardDescription: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    lineHeight: 20,
    color: colors.grey,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.violet,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.violet,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
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
  input: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.prime,
  },
  inputFocused: {
    borderColor: colors.violet,
  },
  inputError: {
    borderColor: colors.dangerText,
    backgroundColor: colors.dangerTint,
  },
  text: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    padding: 0,
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
    ...Platform.select<TextStyle>({
      // Рамку фокуса рисует контейнер поля, браузерная не нужна.
      web: { outlineWidth: 0, outlineStyle: 'none' } as unknown as TextStyle,
    }),
  },
  codeText: {
    // Код читается по группам: без сжатия, как в CopyableCode.
    letterSpacing: 0,
  },
  hint: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    lineHeight: 16,
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  error: {
    color: colors.dangerText,
  },
  footnote: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    color: colors.grey,
  },
  footnoteLink: {
    fontFamily: theme.fonts.semibold,
    color: colors.violetInk,
  },
}));

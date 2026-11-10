import { Platform, StyleSheet, type TextStyle } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  options: {
    gap: 16,
  },
  card: {
    gap: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  cardSelected: {
    borderColor: theme.colors.violet,
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
    color: theme.colors.ink,
  },
  cardDescription: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    lineHeight: 20,
    color: theme.colors.grey,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: theme.colors.violet,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.violet,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.line,
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
  input: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.prime,
  },
  inputFocused: {
    borderColor: theme.colors.violet,
  },
  inputError: {
    borderColor: theme.colors.dangerText,
    backgroundColor: theme.colors.dangerTint,
  },
  text: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    padding: 0,
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
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
    color: theme.colors.grey,
  },
  error: {
    color: theme.colors.dangerText,
  },
  footnote: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    color: theme.colors.grey,
  },
  footnoteLink: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.violet,
  },
});

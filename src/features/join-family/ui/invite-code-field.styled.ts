import { Platform, StyleSheet, type TextStyle } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    gap: 12,
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
    borderColor: theme.colors.danger,
  },
  text: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    padding: 0,
    fontSize: theme.fontSize.sm,
    // Код читается по группам: без сжатия, как в CopyableCode.
    letterSpacing: 0,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
    ...Platform.select<TextStyle>({
      // Рамку фокуса рисует контейнер поля, браузерная не нужна. Значения
      // 'none' нет в типах RN, поэтому приведение через unknown.
      web: { outlineWidth: 0, outlineStyle: 'none' } as unknown as TextStyle,
    }),
  },
  hint: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  error: {
    color: theme.colors.danger,
  },
});

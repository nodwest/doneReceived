import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    color: colors.grey,
  },
  // Ошибка под полем.
  error: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.danger,
  },
  action: {
    gap: 12,
  },
  // Ошибка сервера над кнопкой.
  requestError: {
    textAlign: 'center',
  },
}));

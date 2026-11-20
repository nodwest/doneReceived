import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  list: {
    gap: 8,
  },
  // Лента грузится или не загрузилась: заголовок остаётся на месте, чтобы
  // экран не выглядел пустым.
  state: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  stateText: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  retry: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.violet,
  },
});

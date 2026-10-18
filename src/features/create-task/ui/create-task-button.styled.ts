import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonDisabled: {
    opacity: 1,
  },
  button: {
    height: 56,
    // variant="void" красит фон при hover/нажатии со скруглением rounded-md:
    // повторяем радиус градиента, иначе углы становятся прямоугольными.
    borderRadius: 28,
    overflow: 'hidden',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
});

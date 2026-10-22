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
  button: {
    height: 56,
    // Button красит фон при нажатии со своим скруглением 6:
    // повторяем радиус градиента, иначе углы становятся прямоугольными.
    borderRadius: 28,
    overflow: 'hidden',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  // На вебе наведение не перекрашивает градиент, а нажатие заливает
  // кнопку фиолетовым без затухания — как на нативе.
  buttonHovered: {
    backgroundColor: 'transparent',
  },
  buttonPressed: {
    backgroundColor: theme.colors.violet,
    opacity: 1,
  },
  title: {
    fontSize: 17,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
});

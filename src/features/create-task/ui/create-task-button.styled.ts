import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)',
  },
  button: {
    height: 56,
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

import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0px 6px 14px rgba(30, 154, 92, 0.22)',
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
});

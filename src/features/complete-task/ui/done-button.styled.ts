import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0px 6px 14px rgba(30, 95, 184, 0.22)',
  },
  // На плитке главной.
  md: {
    height: 45,
    borderRadius: 16,
  },
  // В строке списка.
  sm: {
    paddingVertical: 11,
    borderRadius: 14,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  labelSm: {
    fontSize: 15,
    letterSpacing: tracking(15),
  },
});

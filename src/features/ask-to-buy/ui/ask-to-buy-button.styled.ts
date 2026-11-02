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
  compact: {
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: theme.colors.readyText,
  },
  compactLabel: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
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

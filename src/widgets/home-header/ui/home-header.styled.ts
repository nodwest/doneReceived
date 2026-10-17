import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    gap: 4,
  },
  greetingText: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  name: {
    fontSize: 26,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.white,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
});

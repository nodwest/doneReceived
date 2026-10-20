import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  link: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.medium,
    color: theme.colors.violet,
  },
  list: {
    gap: 6,
  },
});

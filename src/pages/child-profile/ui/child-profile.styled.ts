import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  body: {
    gap: 20,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  list: {
    gap: 6,
  },
  empty: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});

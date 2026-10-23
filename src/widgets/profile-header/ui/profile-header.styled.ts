import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
  },
  title: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
});

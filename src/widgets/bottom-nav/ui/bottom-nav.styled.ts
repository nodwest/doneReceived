import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  labelActive: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.violet,
  },
});

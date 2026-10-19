import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 18,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  chipSelected: {
    borderColor: theme.colors.violet,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  name: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
});

import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.prime,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  icon: {
    width: 88,
    height: 88,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: theme.fontSize.h1,
    letterSpacing: tracking(theme.fontSize.h1),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
});

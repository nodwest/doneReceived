import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  body: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    paddingHorizontal: 24,
    fontSize: 22,
    letterSpacing: tracking(22),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  filter: {
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  summary: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  list: {
    marginTop: 16,
    paddingHorizontal: 12,
    gap: 6,
  },
  empty: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});

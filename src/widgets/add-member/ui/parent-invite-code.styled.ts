import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  placeholder: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
  },
  placeholderText: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  error: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.dangerText,
  },
});

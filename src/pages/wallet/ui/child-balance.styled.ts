import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 4px 12px rgba(26, 26, 46, 0.06)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  text: {
    flex: 1,
    gap: 1,
  },
  name: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  balance: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
});

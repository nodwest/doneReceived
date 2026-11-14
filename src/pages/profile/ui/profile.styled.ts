import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

// Отступ разделителя слева: иконка пункта (12 + 36 + 12) и ещё 10.
const DIVIDER_INSET = 70;

export const styles = StyleSheet.create({
  body: {
    gap: 10,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  title: {
    paddingHorizontal: 12,
    fontSize: theme.fontSize.h1,
    fontFamily: theme.fonts.bold,
    letterSpacing: tracking(theme.fontSize.h1),
    color: theme.colors.ink,
  },
  menu: {
    paddingVertical: 4,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 4px 6px rgba(26, 26, 46, 0.06)',
  },
  divider: {
    height: 1,
    marginLeft: DIVIDER_INSET,
    backgroundColor: theme.colors.line,
  },
  logOut: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  logOutText: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.fonts.semibold,
    letterSpacing: tracking(theme.fontSize.md),
    color: theme.colors.grey,
  },
});

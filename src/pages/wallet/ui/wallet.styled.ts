import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

// Отступ разделителя слева: аватар или иконка строки (12 + 40 + 12).
const DIVIDER_INSET = 64;

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
    letterSpacing: tracking(theme.fontSize.h1),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  children: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionHeader: {
    paddingTop: 4,
    paddingHorizontal: 12,
  },
  transactions: {
    paddingVertical: 4,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 4px 12px rgba(26, 26, 46, 0.06)',
  },
  divider: {
    height: 1,
    marginLeft: DIVIDER_INSET,
    marginRight: 12,
    backgroundColor: theme.colors.line,
  },
  empty: {
    paddingVertical: 16,
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});

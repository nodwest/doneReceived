import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  panel: {
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flexShrink: 1,
    fontSize: 17,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  hint: {
    fontSize: theme.fontSize.inputName,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});

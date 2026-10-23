import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  totals: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  total: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 14,
  },
  label: {
    flexShrink: 1,
    fontSize: theme.fontSize.inputName,
    fontFamily: theme.fonts.medium,
  },
  amount: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
  },
});

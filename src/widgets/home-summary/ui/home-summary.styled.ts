import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

const card = {
  flex: 1,
  minHeight: 127,
  gap: 8,
  padding: 16,
  borderRadius: 20,
  boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)',
} as const;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    ...card,
    backgroundColor: theme.colors.white,
  },
  cardAccent: card,
  value: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  label: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  textAccent: {
    color: theme.colors.white,
  },
});

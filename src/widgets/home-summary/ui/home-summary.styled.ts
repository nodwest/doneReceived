import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

const card = {
  flex: 1,
  gap: 8,
  paddingVertical: 16,
  paddingHorizontal: 14,
  borderRadius: 20,
  borderWidth: 1,
  boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)',
} as const;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
  },
  card: {
    ...card,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  cardAccent: {
    ...card,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  cardReview: {
    ...card,
    borderColor: theme.colors.reviewBorder,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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

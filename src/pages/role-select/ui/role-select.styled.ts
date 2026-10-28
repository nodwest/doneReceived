import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  options: {
    gap: 16,
  },
  card: {
    gap: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  cardSelected: {
    borderColor: theme.colors.violet,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.line,
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  cardDescription: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    lineHeight: 20,
    color: theme.colors.grey,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: theme.colors.violet,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.violet,
  },
});

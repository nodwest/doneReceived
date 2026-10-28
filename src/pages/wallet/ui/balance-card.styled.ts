import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    gap: 4,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: theme.colors.reviewBorder,
    boxShadow: '0px 4px 12px rgba(26, 26, 46, 0.06)',
  },
  caption: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: theme.colors.heroSubtle,
  },
  balance: {
    fontSize: 38,
    letterSpacing: tracking(38),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  deposit: {
    backgroundColor: theme.colors.white,
  },
  withdraw: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  buttonText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
  },
  depositText: {
    color: theme.colors.parentFrom,
  },
  withdrawText: {
    color: theme.colors.white,
  },
});

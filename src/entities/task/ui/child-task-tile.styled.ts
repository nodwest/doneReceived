import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  tile: {
    gap: 14,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 6px 16px rgba(26, 26, 51, 0.06)',
  },
  pressed: {
    opacity: 0.85,
  },
  // В карусели плитки одной высоты: верх растягивается, низ — у края.
  main: {
    flexGrow: 1,
    gap: 10,
  },
  sentBackText: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.sentBack,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});

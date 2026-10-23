import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  away: {
    backgroundColor: theme.colors.line,
  },
  text: {
    fontSize: theme.fontSize.inputName,
    fontFamily: theme.fonts.semibold,
  },
  homeText: {
    color: theme.colors.homeBrown,
  },
  awayText: {
    color: theme.colors.inkSoft,
  },
});

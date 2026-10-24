import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.6,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.violetIcon,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontFamily: theme.fonts.semibold,
    letterSpacing: tracking(15),
    color: theme.colors.ink,
  },
  value: {
    fontSize: theme.fontSize.inputName,
    fontFamily: theme.fonts.medium,
    letterSpacing: tracking(theme.fontSize.inputName),
    color: theme.colors.grey,
  },
});

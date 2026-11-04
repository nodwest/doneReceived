import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 14,
    backgroundColor: theme.colors.white,
  },
  icon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: theme.colors.prime,
  },
  iconOnline: {
    backgroundColor: theme.colors.violetSoft,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  status: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
  remove: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: theme.colors.dangerSoft,
  },
  pressed: {
    opacity: 0.7,
  },
});

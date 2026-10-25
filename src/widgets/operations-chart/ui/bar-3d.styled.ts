import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  labelBox: {
    position: 'absolute',
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  label: {
    fontSize: 11.2,
    letterSpacing: tracking(11.2),
    fontFamily: theme.fonts.bold,
  },
});

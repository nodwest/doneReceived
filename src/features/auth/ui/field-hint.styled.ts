import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mark: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.blue,
  },
  dotError: {
    backgroundColor: theme.colors.danger,
  },
  dotMuted: {
    backgroundColor: theme.colors.grey,
  },
  text: {
    flexShrink: 1,
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
  },
  hint: {
    color: theme.colors.blue,
  },
  met: {
    color: theme.colors.readyText,
  },
  error: {
    color: theme.colors.danger,
  },
  muted: {
    color: theme.colors.grey,
  },
});

import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  shadow: {
    borderRadius: 20,
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.05)',
  },
  card: {
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  texts: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.bold,
    letterSpacing: tracking(theme.fontSize.sm),
    color: theme.colors.ink,
  },
  hint: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fonts.medium,
    letterSpacing: tracking(theme.fontSize.xs),
    color: theme.colors.inkSoft,
  },
});

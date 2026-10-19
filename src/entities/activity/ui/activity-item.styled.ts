import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  middle: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  subtitleApproved: {
    color: theme.colors.success,
  },
  reward: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.yellow,
  },
});

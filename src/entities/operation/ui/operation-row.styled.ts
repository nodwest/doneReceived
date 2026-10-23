import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  middle: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
  reward: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: theme.colors.rewardSoft,
  },
  rewardText: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: theme.colors.rewardText,
  },
});

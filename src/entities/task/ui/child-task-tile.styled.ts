import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  tile: {
    gap: 12,
    padding: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 6px 16px rgba(26, 26, 51, 0.06)',
  },
  pressed: {
    opacity: 0.85,
  },
  main: {
    gap: 12,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.white,
    boxShadow: '0px 2px 6px rgba(26, 26, 51, 0.12)',
  },
  titleWrap: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 17,
    letterSpacing: tracking(17),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  from: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  sentBack: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.dangerText,
  },
  fromName: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.inkSoft,
  },
  timer: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 18,
  },
  timerWarm: {
    backgroundColor: theme.colors.timerWarm,
  },
  timerCool: {
    backgroundColor: theme.colors.timerCool,
  },
  timerText: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    fontVariant: ['tabular-nums'],
  },
  description: {
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.regular,
    color: theme.colors.inkSoft,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

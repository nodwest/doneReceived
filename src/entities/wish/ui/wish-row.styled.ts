import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
  },
  cardReady: {
    borderColor: theme.colors.readyBorder,
  },
  cardCurrent: {
    borderWidth: 1.5,
    borderColor: 'rgba(74, 158, 240, 0.45)',
  },
  // Поднятая строка, пока её перетаскивают.
  cardLifted: {
    boxShadow: '0px 12px 24px rgba(26, 26, 46, 0.16)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  iconReady: {
    backgroundColor: theme.colors.readyIconBg,
  },
  iconWaiting: {
    backgroundColor: theme.colors.waitingIconBg,
  },
  photo: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  price: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  textWaiting: {
    color: theme.colors.inkSoft,
  },
  track: {
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
  },
  trackWaiting: {
    borderWidth: 0,
    backgroundColor: theme.colors.line,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.readySoft,
  },
  chipText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: theme.colors.readyText,
  },
  saved: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.childDeep,
  },
});

import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    gap: 4,
    padding: 16,
    borderRadius: 24,
    boxShadow: '0px 4px 12px rgba(26, 26, 46, 0.06)',
  },
  cardParent: {
    borderWidth: 1.5,
    borderColor: theme.colors.reviewBorder,
  },
  caption: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: theme.colors.heroSubtle,
  },
  captionChild: {
    color: 'rgba(255, 255, 255, 0.92)',
  },
  // «+$28 this week» в правом верхнем углу карточки ребёнка.
  week: {
    position: 'absolute',
    top: 27,
    right: 16,
    alignItems: 'flex-end',
    gap: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  weekValue: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.white,
  },
  weekLabel: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.medium,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  balance: {
    fontSize: 38,
    letterSpacing: tracking(38),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  deposit: {
    backgroundColor: theme.colors.white,
  },
  withdraw: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  buttonText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
  },
  depositText: {
    color: theme.colors.parentFrom,
  },
  withdrawText: {
    color: theme.colors.white,
  },
});

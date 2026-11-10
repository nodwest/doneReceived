import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  cardOver: {
    borderColor: 'rgba(229, 72, 77, 0.3)',
    backgroundColor: theme.colors.dangerTint,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  titleOver: {
    color: theme.colors.dangerText,
  },
  amount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  amountValue: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  amountFree: {
    color: theme.colors.fundsFree,
  },
  amountUnit: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  meter: {
    gap: 6,
  },
  limitRow: {
    flexDirection: 'row',
  },
  limit: {
    flexBasis: 0,
    alignItems: 'flex-end',
  },
  limitText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 14,
    rowGap: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  note: {
    flex: 1,
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    lineHeight: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
  },
  deposit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: theme.colors.violet,
  },
  depositLabel: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.white,
  },
  pressed: {
    opacity: 0.8,
  },
});

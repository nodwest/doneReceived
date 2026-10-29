import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

// Ширина открытых действий: две кнопки по 60, промежуток 8 и отступ 12.
export const ACTIONS_WIDTH = 140;

export const styles = StyleSheet.create({
  body: {
    gap: 10,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 22,
    letterSpacing: tracking(22),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  balance: {
    gap: 2,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  balanceTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  balanceHint: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.regular,
    color: theme.colors.white,
    opacity: 0.9,
  },
  handle: {
    width: 14,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 18,
  },
  edit: {
    backgroundColor: theme.colors.childFrom,
  },
  delete: {
    backgroundColor: theme.colors.dangerAction,
  },
  pressed: {
    opacity: 0.8,
  },
  actionLabel: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.white,
  },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(74, 158, 240, 0.6)',
    backgroundColor: 'rgba(74, 158, 240, 0.06)',
  },
  addLabel: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.childDeep,
  },
  empty: {
    marginVertical: 24,
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});

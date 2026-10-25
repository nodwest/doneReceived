import { StyleSheet } from 'react-native';
import { theme, tracking } from '../../theme';

export const WHEEL_ITEM_HEIGHT = 44;

export const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 16,
  },
  header: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  title: {
    fontSize: theme.fontSize.lg,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  summary: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.violet,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  colon: {
    fontSize: 24,
    letterSpacing: tracking(24),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  wheelBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: WHEEL_ITEM_HEIGHT,
    borderRadius: 12,
    backgroundColor: theme.colors.prime,
  },
  wheelItem: {
    height: WHEEL_ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelText: {
    fontSize: 22,
    letterSpacing: tracking(22),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  wheelTextSelected: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  wheelTextDisabled: {
    color: theme.colors.placeholder,
  },

  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancel: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: theme.colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },
  cancelText: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: theme.colors.grey,
  },
  confirmWrap: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },
  confirm: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmPressed: {
    backgroundColor: theme.colors.violet,
  },
  confirmText: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
});

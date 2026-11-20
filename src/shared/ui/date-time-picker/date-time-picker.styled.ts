import { createStyles, theme, tracking } from '../../theme';

export const WHEEL_ITEM_HEIGHT = 44;

export const styles = createStyles((colors) => ({
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
    color: colors.ink,
  },
  summary: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.violetInk,
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
    color: colors.ink,
  },
  wheelBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: WHEEL_ITEM_HEIGHT,
    borderRadius: 12,
    backgroundColor: colors.prime,
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
    color: colors.grey,
  },
  wheelTextSelected: {
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  wheelTextDisabled: {
    color: colors.placeholder,
  },

  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancel: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  cancelText: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: colors.grey,
  },
  confirmWrap: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
  },
  confirm: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmPressed: {
    backgroundColor: colors.violet,
  },
  confirmText: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: colors.white,
  },
}));

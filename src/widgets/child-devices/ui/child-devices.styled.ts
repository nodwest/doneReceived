import { createStyles, theme, tracking } from '@shared/theme';
import { withAlpha } from '@shared/lib';

export const styles = createStyles((colors) => ({
  // Строка-переключатель: «2 devices ⌄», заголовок раскрытого блока
  // «Devices ⌃» или «No devices yet» с кнопкой Connect device.
  toggle: {
    minHeight: 41,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 14,
  },
  toggleNone: {
    paddingTop: 11,
  },
  toggleLabel: {
    flex: 1,
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
  toggleLabelNone: {
    color: colors.grey,
  },
  toggleLabelOpen: {
    color: colors.violetInk,
  },
  connect: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.violet,
  },
  connectLabel: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.semibold,
    color: colors.white,
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
  },
  panel: {
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  panelConnect: {
    gap: 10,
  },
  connectNew: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: withAlpha(colors.violet, 0.35),
    backgroundColor: colors.violetSoft,
  },
  connectNewLabel: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: colors.violetInk,
  },
  pressed: {
    opacity: 0.7,
  },
  removeConfirmation: {
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  removeTitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  removeMessage: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
  removeActions: {
    flexDirection: 'row',
    gap: 12,
  },
}));

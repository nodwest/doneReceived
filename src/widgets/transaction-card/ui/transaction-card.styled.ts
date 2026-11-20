import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  section: {
    gap: 10,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 14,
    borderRadius: 16,
    backgroundColor: colors.stepperBg,
  },
  taskChild: {
    backgroundColor: colors.currentBg,
  },
  pressed: {
    opacity: 0.85,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  taskText: {
    flex: 1,
    gap: 3,
  },
  taskTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  taskCaption: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.regular,
    color: colors.grey,
  },
  details: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.detailsBg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 11,
  },
  detailKey: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  detailValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  note: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(66, 84, 173, 0.18)',
    backgroundColor: colors.prime,
  },
  noteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.parentTo,
  },
  noteIconChild: {
    backgroundColor: colors.childDeep,
  },
  noteText: {
    flex: 1,
    gap: 2,
  },
  noteTitle: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  noteCaption: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
}));

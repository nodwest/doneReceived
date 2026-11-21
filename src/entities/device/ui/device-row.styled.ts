import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  icon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.prime,
  },
  selection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 36,
  },
  tracked: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 26,
    height: 34,
  },
  iconOnline: {
    backgroundColor: colors.violetSoft,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  status: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.regular,
    color: colors.grey,
  },
  remove: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: colors.dangerSoft,
  },
  pressed: {
    opacity: 0.7,
  },
}));

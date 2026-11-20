import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  tile: {
    gap: 14,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pressed: {
    opacity: 0.85,
  },
  // В карусели плитки одной высоты: верх растягивается, низ — у края.
  main: {
    flexGrow: 1,
    gap: 10,
  },
  sentBackText: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: colors.sentBack,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
}));

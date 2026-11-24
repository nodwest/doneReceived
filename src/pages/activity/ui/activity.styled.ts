import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  // Назад слева, заголовок по центру между ней и пустым местом справа.
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: tracking(22),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  headerSpacer: {
    width: 44,
  },
  filter: {
    marginTop: 12,
    paddingHorizontal: 12,
  },
  list: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  day: {
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 6,
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  separator: {
    height: 8,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 24,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  retry: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: colors.blueInk,
  },
}));

import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  scroll: {
    flex: 1,
  },
  body: {
    gap: 14,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 30,
    letterSpacing: tracking(30),
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  sectionList: {
    gap: 10,
  },
  upcomingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  upcomingCell: {
    width: '49%',
  },
  loading: {
    paddingVertical: 24,
  },
  errorCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerTint,
    gap: 4,
  },
  errorTitle: {
    fontSize: 12,
    letterSpacing: tracking(12),
    fontFamily: theme.fonts.semibold,
    color: colors.dangerText,
  },
  errorLink: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: colors.dangerText,
  },
  emptyCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    gap: 5,
  },
  emptyTitle: {
    fontSize: 14,
    letterSpacing: tracking(14),
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  emptyHint: {
    fontSize: 11,
    letterSpacing: tracking(11),
    lineHeight: 16,
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  emptyAction: {
    marginTop: 4,
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: colors.blueInk,
  },
}));

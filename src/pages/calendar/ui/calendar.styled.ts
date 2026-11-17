import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
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
    color: theme.colors.ink,
  },
  sectionList: {
    gap: 10,
  },
  upcomingRow: {
    flexDirection: 'row',
    gap: 10,
  },
  loading: {
    paddingVertical: 24,
  },
  monthEmpty: {
    fontSize: 10,
    letterSpacing: tracking(10),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
    textAlign: 'center',
  },
  errorCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.dangerBorder,
    backgroundColor: theme.colors.dangerTint,
    gap: 4,
  },
  errorTitle: {
    fontSize: 12,
    letterSpacing: tracking(12),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.dangerText,
  },
  errorLink: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: theme.colors.dangerText,
  },
  emptyCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    gap: 5,
  },
  emptyTitle: {
    fontSize: 14,
    letterSpacing: tracking(14),
    fontFamily: theme.fonts.extrabold,
    color: theme.colors.ink,
  },
  emptyHint: {
    fontSize: 11,
    letterSpacing: tracking(11),
    lineHeight: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  emptyAction: {
    marginTop: 4,
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: theme.colors.blue,
  },
});

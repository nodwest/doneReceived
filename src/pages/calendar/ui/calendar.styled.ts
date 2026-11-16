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
});

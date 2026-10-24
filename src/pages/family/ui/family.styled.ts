import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  body: {
    gap: 20,
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  // «Family» и счётчик участников в одну строку, по нижней линии текста.
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  count: {
    flexShrink: 1,
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  list: {
    gap: 10,
  },
});

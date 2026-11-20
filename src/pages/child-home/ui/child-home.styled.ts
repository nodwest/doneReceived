import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: theme.colors.prime,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  scroll: {
    flex: 1,
  },
  body: {
    gap: 18,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 12,
  },
  loading: {
    marginTop: 40,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});

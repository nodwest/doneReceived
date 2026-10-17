import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

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
    gap: 24,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
});

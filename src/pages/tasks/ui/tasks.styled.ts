import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const FOOTER_PADDING_VERTICAL = 12;

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
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 12,
  },
  // Карусель занимает всю высоту между шапкой и футером.
  bodyCards: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  empty: {
    marginTop: 48,
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: FOOTER_PADDING_VERTICAL,
    backgroundColor: theme.colors.white,
  },
});

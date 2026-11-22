import { createStyles } from '@shared/theme';

export const styles = createStyles((colors) => ({
  screen: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: colors.prime,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  childrenStatus: { color: colors.blueInk },
  childrenRetry: {
    color: colors.blueInk,
    textDecorationLine: 'underline',
    paddingVertical: 8,
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
}));

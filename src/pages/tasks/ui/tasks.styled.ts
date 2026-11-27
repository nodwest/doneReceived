import { createStyles, theme, tracking } from '@shared/theme';

// Отступ под точками карусели, когда снизу нет навбара.
export const CARDS_PADDING_BOTTOM = 16;

export const styles = createStyles((colors) => ({
  screen: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: colors.taskScreen,
  },
  container: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  scroll: {
    flex: 1,
  },
  body: {
    // Строки слов дня над списком — с тем же шагом, что плитки.
    gap: 12,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 12,
  },
  // Карусель занимает всю высоту под шапкой; карточки — 16pt от краёв.
  cards: {
    flex: 1,
    minHeight: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  empty: {
    marginTop: 48,
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
}));

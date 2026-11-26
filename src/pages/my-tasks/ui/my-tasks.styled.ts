import { TILE_GAP } from '@entities/task';
import { createStyles, theme, tracking } from '@shared/theme';

// Отступ под точками карусели, когда снизу нет навбара.
export const CARDS_PADDING_BOTTOM = 16;

export const styles = createStyles((colors) => ({
  screen: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: colors.prime,
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
  // Список и панель проверки лежат друг над другом во всю высоту под шапкой.
  scrollArea: {
    flex: 1,
    minHeight: 0,
  },
  // Вкладка проверки: непрозрачная панель над уже нарисованным списком.
  reviewOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.prime,
  },
  body: {
    gap: 16,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 12,
  },
  section: {
    gap: TILE_GAP,
  },
  // Вкладка не на экране: дерево остаётся смонтированным, но не занимает места.
  hiddenTab: {
    display: 'none',
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
  loading: {
    marginTop: 48,
    alignSelf: 'center',
  },
}));

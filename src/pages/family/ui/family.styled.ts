import { createStyles, theme, tracking } from '@shared/theme';

// Кнопка Delete под смахнутой карточкой нового ребёнка и отступ от неё.
export const DELETE_ACTION_WIDTH = 72;

// Отступ от края экрана до раскрытого блока устройств после докрутки.
export const REVEAL_GAP = 16;

export const styles = createStyles((colors) => ({
  viewport: {
    flex: 1,
  },
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
    letterSpacing: tracking(26),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  count: {
    flexShrink: 1,
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  list: {
    gap: 10,
  },
  // Delete как в вишлисте: красная плитка с корзиной и подписью.
  delete: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 18,
    backgroundColor: colors.dangerAction,
    boxShadow:
      '0px 8px 16px rgba(26, 26, 46, 0.24), 0px 2px 4px rgba(26, 26, 46, 0.12)',
  },
  deleteLabel: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.semibold,
    color: colors.white,
  },
  pressed: {
    opacity: 0.8,
  },
}));

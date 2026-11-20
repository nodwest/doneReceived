import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  // Назад слева, кнопка вида справа, заголовок по центру между ними.
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: tracking(22),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  headerSpacer: {
    width: 44,
  },
  filter: {
    marginTop: 12,
    paddingHorizontal: 12,
  },
  body: {
    gap: 18,
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  day: {
    gap: 8,
  },
  dayHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 6,
  },
  dayTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  totals: {
    flexDirection: 'row',
    gap: 8,
  },
  income: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: colors.rewardText,
  },
  outcome: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: colors.reviewChipText,
  },
  outcomeChild: {
    color: colors.queueText,
  },
  empty: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  // Карточки транзакций дня во всю высоту под шапкой.
  cards: {
    flex: 1,
    minHeight: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
}));

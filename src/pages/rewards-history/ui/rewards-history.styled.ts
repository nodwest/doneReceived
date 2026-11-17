import { StyleSheet } from 'react-native';
import { TILE_GAP } from '@entities/task';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  body: {
    paddingBottom: 24,
  },
  // Назад слева, кнопка вида справа, заголовок по центру между ними.
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  headerSpacer: {
    width: 44,
  },
  // Тогл Done / Missed по центру шапки вместо заголовка.
  toggle: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: tracking(22),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  filter: {
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  // Без фильтра по детям график стоит чуть ниже шапки.
  noFilter: {
    height: 8,
  },
  summary: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  list: {
    marginTop: 16,
    paddingHorizontal: 12,
    gap: 6,
  },
  // Все выплаченные задания плитками по дням.
  paidList: {
    gap: TILE_GAP,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  paidDay: {
    gap: TILE_GAP,
  },
  paidDayHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  paidDayTitle: {
    fontSize: 17,
    letterSpacing: tracking(17),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  paidDayTotal: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.rewardText,
  },
  missedDayTotal: {
    color: theme.colors.missedDeep,
  },
  // Карточки наград дня во всю высоту под шапкой.
  cards: {
    flex: 1,
    minHeight: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  // Карточек этого вида в выбранный день нет (тогл Missed без упущенных).
  emptyCards: {
    marginTop: 48,
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  empty: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});

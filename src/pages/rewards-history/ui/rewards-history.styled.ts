import { StyleSheet } from 'react-native';
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
  // Карточки наград дня во всю высоту под шапкой.
  cards: {
    flex: 1,
    minHeight: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
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

import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  containerInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  totals: {
    flexDirection: 'row',
    gap: 8,
  },
  totalsInline: {
    flex: 1,
    gap: 6,
  },
  // Подпись слева, сумма прижата к правому краю плашки.
  total: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  // Рядом с датой места меньше: плашка плотнее, сумма сразу за подписью.
  totalInline: {
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 6,
  },
  label: {
    flex: 1,
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
  },
  amount: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
  },
  // Ширина по тексту (без растягивания), сужается только если не влезает.
  labelInline: {
    flexGrow: 0,
    flexBasis: 'auto',
  },
});

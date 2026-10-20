import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const CAROUSEL_GUTTER = 12;
export const CAROUSEL_GAP = 12;
const SHADOW_ROOM = 24;
// Какая часть следующей карточки выглядывает у правого края (как в макете).
export const CAROUSEL_PEEK = 24;

export const styles = StyleSheet.create({
  // Лента выходит за боковые отступы страницы, чтобы следующая карточка была видна у края.
  // Вертикальный запас в ленте нужен для тени карточки, снаружи он гасится отрицательным отступом.
  scroll: {
    marginHorizontal: -CAROUSEL_GUTTER,
    marginVertical: -SHADOW_ROOM,
  },
  track: {
    paddingHorizontal: CAROUSEL_GUTTER,
    gap: CAROUSEL_GAP,
    // Запас под тень: бокс-тень карточки не должна обрезаться лентой.
    paddingVertical: SHADOW_ROOM,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.placeholder,
  },
  dotActive: {
    width: 20,
    backgroundColor: theme.colors.violet,
  },
});

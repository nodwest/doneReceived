import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const CAROUSEL_GUTTER = 12;
export const CAROUSEL_GAP = 12;
// Какая часть следующей карточки выглядывает у правого края (как в макете).
export const CAROUSEL_PEEK = 16;
// Запас под тень карточки: снаружи он гасится отрицательным отступом.
const SHADOW_TOP = 12;
const SHADOW_BOTTOM = 24;

export const styles = StyleSheet.create({
  // Лента растягивается на всю свободную высоту, карточки — вслед за ней.
  root: {
    flexGrow: 1,
  },
  // Лента выходит за боковые отступы страницы, чтобы следующая карточка была видна у края.
  scroll: {
    flexGrow: 1,
    marginHorizontal: -CAROUSEL_GUTTER,
    marginTop: -SHADOW_TOP,
    marginBottom: -SHADOW_BOTTOM,
  },
  track: {
    flexGrow: 1,
    gap: CAROUSEL_GAP,
    paddingHorizontal: CAROUSEL_GUTTER,
    paddingTop: SHADOW_TOP,
    paddingBottom: SHADOW_BOTTOM,
  },
  hidden: {
    opacity: 0,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 13,
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

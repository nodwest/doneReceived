import { StyleSheet } from 'react-native';
import { withAlpha } from '@shared/lib';
import { theme, themedArray } from '@shared/theme';
import { CHART_HEIGHT } from '../config/sizes';

// Фон экрана (theme.colors.prime) от плотного к прозрачному.
export const FADE_COLORS = themedArray<readonly [string, string, string]>(
  () => [
    withAlpha(theme.colors.prime, 0.85),
    withAlpha(theme.colors.prime, 0.3),
    withAlpha(theme.colors.prime, 0),
  ],
);

export const styles = StyleSheet.create({
  container: {
    height: CHART_HEIGHT,
  },
  hidden: {
    opacity: 0,
  },
  // Последняя колонка обрезается краем экрана.
  future: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  fade: {
    position: 'absolute',
    top: 0,
    width: 36,
    height: CHART_HEIGHT,
    pointerEvents: 'none',
  },
  fadeLeft: {
    left: 0,
  },
  fadeRight: {
    right: 0,
  },
});

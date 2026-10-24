import { StyleSheet } from 'react-native';
import { CHART_HEIGHT } from '../config/sizes';

// Фон экрана (theme.colors.prime) от плотного к прозрачному.
export const FADE_COLORS = [
  'rgba(245, 246, 250, 0.85)',
  'rgba(245, 246, 250, 0.3)',
  'rgba(245, 246, 250, 0)',
] as const;

export const styles = StyleSheet.create({
  container: {
    height: CHART_HEIGHT,
  },
  hidden: {
    opacity: 0,
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

import { useWindowDimensions } from 'react-native';

const COMPACT_WIDTH = 360;

/** Узкие телефоны (< 360pt): уменьшаем отступы и крупные шрифты. */
export function useIsCompact() {
  return useWindowDimensions().width < COMPACT_WIDTH;
}

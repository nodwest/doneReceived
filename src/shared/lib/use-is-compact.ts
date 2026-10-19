import { useWindowDimensions } from 'react-native';

const COMPACT_WIDTH = 360;

/** Узкие телефоны (по умолчанию < 360pt): уменьшаем отступы и крупные шрифты. */
export function useIsCompact(breakpoint = COMPACT_WIDTH) {
  return useWindowDimensions().width < breakpoint;
}

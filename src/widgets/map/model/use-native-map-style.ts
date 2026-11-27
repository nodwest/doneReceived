import type { StyleSpecification } from '@maplibre/maplibre-react-native';
import { useTheme } from '@shared/theme';
import { MAP_STYLES } from '../config/map-style';

export function useNativeMapStyle() {
  const { mode } = useTheme();
  return { mode, mapStyle: MAP_STYLES[mode] as unknown as StyleSpecification };
}

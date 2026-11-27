import { useEffect, type RefObject } from 'react';
import type { Map } from 'maplibre-gl';
import { useTheme } from '@shared/theme';
import { MAP_STYLES } from '../config/map-style';
import { applyMapPaint } from './apply-map-paint';

export function useWebMapStyle(mapRef: RefObject<Map | null>) {
  const { mode } = useTheme();

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const { layers } = MAP_STYLES[mode];
    const apply = () => {
      // Меняем только подложку. Камера, редактор и слои семьи сохраняются.
      for (const layer of layers) {
        if (!('paint' in layer) || !layer.paint) continue;
        applyMapPaint(map, layer.id, layer.paint);
      }
    };

    if (map.getLayer(layers[0].id)) apply();
    else map.once('load', apply);

    return () => {
      map.off('load', apply);
    };
  }, [mapRef, mode]);
}

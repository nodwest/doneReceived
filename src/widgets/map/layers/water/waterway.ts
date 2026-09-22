import { MapLayer } from '@widgets/map/types/types';

export const waterwayLayer: MapLayer = {
  id: 'waterway',
  type: 'line',
  source: 'osm',
  'source-layer': 'waterway',

  paint: {
    'line-color': '#8ac6e8',
    'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.5, 10, 1.5, 14, 3],
  },
};

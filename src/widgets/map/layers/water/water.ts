import { MapLayer } from '@widgets/map/types/types';

export const waterLayer: MapLayer = {
  id: 'water',
  type: 'fill',
  source: 'osm',
  'source-layer': 'water',
  paint: {
    'fill-color': '#8ac6e8',
    'fill-opacity': 1,
  },
};

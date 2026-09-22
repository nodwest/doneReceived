import { MapLayer } from '@widgets/map/types/types';

export const roadsCasingLayer: MapLayer = {
  id: 'roads-casing',
  type: 'line',
  source: 'osm',
  'source-layer': 'transportation',

  paint: {
    'line-color': '#b8b8b8',
    'line-width': ['interpolate', ['linear'], ['zoom'], 5, 1, 10, 3, 14, 8],
  },
};

export const roadsLayer: MapLayer = {
  id: 'roads',
  type: 'line',
  source: 'osm',
  'source-layer': 'transportation',

  paint: {
    'line-color': '#ffffff',
    'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.5, 10, 2, 14, 6],
  },
};

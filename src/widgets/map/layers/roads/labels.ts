import { MapLayer } from '@widgets/map/types/types';

export const roadLabelsLayer: MapLayer = {
  id: 'roads-labels',
  type: 'symbol',
  source: 'osm',
  'source-layer': 'transportation_name',

  minzoom: 11,

  layout: {
    'text-field': ['get', 'name'],

    'text-size': ['interpolate', ['linear'], ['zoom'], 11, 9, 14, 12],

    'text-font': ['Open Sans Regular'],

    'symbol-placement': 'line',
    'symbol-spacing': 300,

    'text-rotation-alignment': 'map',
    'text-pitch-alignment': 'viewport',

    'text-padding': 4,
    'text-max-angle': 30,

    'text-allow-overlap': false,
    'text-ignore-placement': false,
  },

  paint: {
    'text-color': '#555555',
    'text-halo-color': '#ffffff',
    'text-halo-width': 1.5,
    'text-halo-blur': 0.2,
  },
};

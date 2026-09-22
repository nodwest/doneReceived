import { MapLayer } from '@widgets/map/types/types';

export const citiesMajorLayer: MapLayer = {
  id: 'cities-major',
  type: 'symbol',
  source: 'osm',
  'source-layer': 'place',

  minzoom: 4,
  maxzoom: 7,

  filter: [
    'any',
    ['==', ['get', 'class'], 'city'],
    ['==', ['get', 'class'], 'town'],
  ],

  layout: {
    'text-field': ['get', 'name'],
    'text-size': ['interpolate', ['linear'], ['zoom'], 4, 12, 7, 15],
    'text-font': ['Open Sans Regular'],
    'text-anchor': 'center',
    'text-padding': 4,
  },

  paint: {
    'text-color': '#222222',
    'text-halo-color': '#ffffff',
    'text-halo-width': 1.8,
  },
};

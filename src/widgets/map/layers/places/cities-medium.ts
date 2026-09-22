import { MapLayer } from '@widgets/map/types/types';

export const citiesMediumLayer: MapLayer = {
  id: 'cities-medium',
  type: 'symbol',
  source: 'osm',
  'source-layer': 'place',
  minzoom: 7,
  maxzoom: 10,
  filter: [
    'any',
    ['==', ['get', 'class'], 'city'],
    ['==', ['get', 'class'], 'town'],
    ['==', ['get', 'class'], 'village'],
  ],
  layout: {
    'text-field': ['get', 'name'],
    'text-size': ['interpolate', ['linear'], ['zoom'], 7, 11, 10, 14],
    'text-font': ['Open Sans Regular'],
    'text-anchor': 'center',
    'text-padding': 3,
  },
  paint: {
    'text-color': '#333333',
    'text-halo-color': '#ffffff',
    'text-halo-width': 1.5,
  },
};

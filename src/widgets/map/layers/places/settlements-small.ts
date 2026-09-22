import { MapLayer } from '@widgets/map/types/types';

export const settlementsSmallLayer: MapLayer = {
  id: 'settlements-small',
  type: 'symbol',
  source: 'osm',
  'source-layer': 'place',
  minzoom: 10,
  filter: [
    'any',
    ['==', ['get', 'class'], 'village'],
    ['==', ['get', 'class'], 'hamlet'],
  ],
  layout: {
    'text-field': ['get', 'name'],
    'text-size': ['interpolate', ['linear'], ['zoom'], 10, 10, 14, 12],
    'text-font': ['Open Sans Regular'],
    'text-anchor': 'center',
    'text-padding': 2,
  },
  paint: {
    'text-color': '#555555',
    'text-halo-color': '#ffffff',
    'text-halo-width': 1.2,
  },
};

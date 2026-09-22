import type { SymbolLayerSpecification } from 'maplibre-gl';

export const houseNumbersLayer: SymbolLayerSpecification = {
  id: 'house-numbers',
  type: 'symbol',
  source: 'osm',
  'source-layer': 'housenumber',

  minzoom: 15,

  layout: {
    'text-field': ['get', 'housenumber'],

    'text-size': ['interpolate', ['linear'], ['zoom'], 16, 9, 18, 11],

    'text-font': ['Open Sans Regular'],
    'text-anchor': 'center',

    'text-allow-overlap': false,
    'text-ignore-placement': false,
    'text-padding': 2,
  },

  paint: {
    'text-color': '#555555',
    'text-halo-color': '#ffffff',
    'text-halo-width': 1,
  },
};

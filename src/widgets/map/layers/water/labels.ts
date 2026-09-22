import type { SymbolLayerSpecification } from 'maplibre-gl';

export const waterLabelsLayer: SymbolLayerSpecification = {
  id: 'water-labels',
  type: 'symbol',
  source: 'osm',
  'source-layer': 'water_name',

  minzoom: 9,

  layout: {
    'text-field': ['get', 'name'],

    'text-size': ['interpolate', ['linear'], ['zoom'], 9, 10, 14, 13],

    'text-font': ['Open Sans Italic'],
    'text-letter-spacing': 0.02,

    'text-allow-overlap': false,
    'text-ignore-placement': false,
    'text-padding': 4,
  },

  paint: {
    'text-color': '#4f8fb3',
    'text-halo-color': '#ffffff',
    'text-halo-width': 1.5,
    'text-halo-blur': 0.2,
  },
};

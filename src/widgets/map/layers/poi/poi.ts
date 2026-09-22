import type { SymbolLayerSpecification } from 'maplibre-gl';

export const poiLayer: SymbolLayerSpecification = {
  id: 'poi',
  type: 'symbol',
  source: 'osm',
  'source-layer': 'poi',

  minzoom: 14,

  layout: {
    'text-field': ['get', 'name'],

    'text-size': ['interpolate', ['linear'], ['zoom'], 14, 9, 18, 12],

    'text-font': ['Open Sans Regular'],
    'text-anchor': 'top',
    'text-offset': [0, 0.8],

    'text-allow-overlap': false,
    'text-ignore-placement': false,
    'text-padding': 3,
  },

  paint: {
    'text-color': '#444444',
    'text-halo-color': '#ffffff',
    'text-halo-width': 1.2,
    'text-halo-blur': 0.1,
  },
};

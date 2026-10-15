import type { CircleLayerSpecification } from 'maplibre-gl';

export const userLayer: CircleLayerSpecification = {
  id: 'users',
  type: 'circle',
  source: 'users',

  paint: {
    'circle-radius': 7,
    'circle-color': '#1976d2',
    'circle-stroke-color': '#ffffff',
    'circle-stroke-width': 2,
  },
};

import { MapLayer } from '../../model/types';

export const landuseLayer: MapLayer = {
  id: 'landuse',
  type: 'fill',
  source: 'osm',
  'source-layer': 'landuse',
  paint: {
    'fill-color': '#e8e3d8',
    'fill-opacity': 0.7,
  },
};

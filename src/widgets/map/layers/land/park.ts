import { MapLayer } from '../../model/types';

export const parkLayer: MapLayer = {
  id: 'park',
  type: 'fill',
  source: 'osm',
  'source-layer': 'park',
  paint: {
    'fill-color': '#81bf83',
  },
};

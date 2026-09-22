import { MapLayer } from '@widgets/map/types/types';

export const parkLayer: MapLayer = {
  id: 'park',
  type: 'fill',
  source: 'osm',
  'source-layer': 'park',
  paint: {
    'fill-color': '#81bf83',
  },
};

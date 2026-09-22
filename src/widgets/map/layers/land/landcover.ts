import { MapLayer } from '@widgets/map/types/types';

export const landcoverLayer: MapLayer = {
  id: 'landcover',
  type: 'fill',
  source: 'osm',
  'source-layer': 'landcover',
  paint: {
    'fill-color': '#d0e6b2',
  },
};

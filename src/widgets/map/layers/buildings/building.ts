import { MapLayer } from '@widgets/map/types/types';

export const buildingLayer: MapLayer = {
  id: 'buildings',
  type: 'fill',
  source: 'osm',
  'source-layer': 'building',
  minzoom: 13,
  paint: {
    'fill-color': '#d9d0c7',
    'fill-opacity': 0.8,
  },
};

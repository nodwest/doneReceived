import { MapLayer } from '../../model/types';

export const buildingLayer: MapLayer = {
  id: 'buildings',
  type: 'fill',
  source: 'osm',
  'source-layer': 'building',
  minzoom: 12,
  paint: {
    'fill-color': '#d9d0c7',
    'fill-opacity': 0.8,
  },
};

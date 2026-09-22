import type { FillExtrusionLayerSpecification } from 'maplibre-gl';

export const buildings3dLayer: FillExtrusionLayerSpecification = {
  id: 'buildings-3d',
  type: 'fill-extrusion',
  source: 'osm',
  'source-layer': 'building',

  minzoom: 15,

  paint: {
    'fill-extrusion-color': '#d9d0c7',

    'fill-extrusion-height': ['coalesce', ['get', 'height'], 10],

    'fill-extrusion-base': ['coalesce', ['get', 'min_height'], 0],

    'fill-extrusion-opacity': 0.9,
  },
};

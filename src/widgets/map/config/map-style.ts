import { layers, namedFlavor } from '@protomaps/basemaps';
import type { StyleSpecification } from 'maplibre-gl';

import { OSM_SOURCE } from './map-source';

export const MAP_STYLE: StyleSpecification = {
  version: 8,

  name: 'DoneReceived',
  glyphs:
    'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
  sprite: 'https://protomaps.github.io/basemaps-assets/sprites/v4/light',

  sources: {
    osm: OSM_SOURCE,
  },

  layers: [...layers('osm', namedFlavor('light'), { lang: 'ru' })],
};

import { layers, namedFlavor } from '@protomaps/basemaps';
import type { StyleSpecification } from 'maplibre-gl';

import { OSM_SOURCE } from './map-source';
import { userLayer } from '../layers/dynamic/user-layer';
import { userSource } from '../layers/dynamic/user-source';

export const MAP_STYLE: StyleSpecification = {
  version: 8,

  name: 'DoneReceived',
  glyphs:
    'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
  sprite: 'https://protomaps.github.io/basemaps-assets/sprites/v4/light',

  sources: {
    osm: OSM_SOURCE,
    users: userSource,
  },

  layers: [...layers('osm', namedFlavor('light'), { lang: 'ru' }), userLayer],
};

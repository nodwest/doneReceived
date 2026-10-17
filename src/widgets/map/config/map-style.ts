import type { StyleSpecification } from 'maplibre-gl';

import { OSM_SOURCE } from './map-source';

import {
  backgroundLayer,
  landcoverLayer,
  landuseLayer,
  parkLayer,
  waterLayer,
  waterLabelsLayer,
  buildingLayer,
  houseNumbersLayer,
  roadsCasingLayer,
  roadsLayer,
  roadLabelsLayer,
  citiesMajorLayer,
  citiesMediumLayer,
  settlementsSmallLayer,
  poiLayer,
  buildings3dLayer,
  waterwayLayer,
} from '../layers';

import { userLayer } from '../layers/dynamic/user-layer';
import { userSource } from '../layers/dynamic/user-source';

export const MAP_STYLE: StyleSpecification = {
  version: 8,

  name: 'Rostov OSM',

  sources: {
    osm: OSM_SOURCE,
    users: userSource,
  },

  layers: [
    backgroundLayer,
    landcoverLayer,
    landuseLayer,
    parkLayer,
    waterLayer,
    waterwayLayer,
    waterLabelsLayer,
    roadsCasingLayer,
    roadsLayer,
    buildingLayer,
    buildings3dLayer,
    houseNumbersLayer,
    poiLayer,
    citiesMajorLayer,
    roadLabelsLayer,
    citiesMediumLayer,
    settlementsSmallLayer,
    userLayer,
  ],
};

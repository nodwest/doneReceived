import { DARK, LIGHT, layers, type Flavor } from '@protomaps/basemaps';
import type { StyleSpecification } from 'maplibre-gl';
import type { ThemeMode } from '@shared/theme';

import { OSM_SOURCE } from './map-source';

const land = '#1B2332';
const park = '#203B36';
const localRoad = '#334056';
const mainRoad = '#495771';
const label = '#B1BDD1';
const halo = '#172030';

const darkFlavor: Flavor = {
  ...DARK,
  // Сохраняем те же шрифты и иконки POI, что у светлой подложки.
  pois: LIGHT.pois,
  background: land,
  earth: land,
  water: '#102C45',
  ocean_label: '#97B5D1',
  park_a: park,
  park_b: park,
  wood_a: park,
  wood_b: park,
  landcover: DARK.landcover && {
    ...DARK.landcover,
    urban_area: land,
    forest: park,
  },
  buildings: '#222D40',
  minor_a: localRoad,
  minor_b: localRoad,
  minor_service: localRoad,
  bridges_minor: localRoad,
  link: mainRoad,
  major: mainRoad,
  highway: '#586781',
  bridges_link: mainRoad,
  bridges_major: mainRoad,
  bridges_highway: '#586781',
  roads_label_minor: label,
  roads_label_minor_halo: halo,
  roads_label_major: label,
  roads_label_major_halo: halo,
  subplace_label: label,
  subplace_label_halo: halo,
  city_label: '#D2DBEA',
  city_label_halo: halo,
  state_label: label,
  state_label_halo: halo,
  country_label: label,
  address_label: label,
  address_label_halo: halo,
};

function createStyle(flavor: Flavor): StyleSpecification {
  return {
    version: 8,

    name: 'DoneReceived',
    glyphs:
      'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
    sprite: 'https://protomaps.github.io/basemaps-assets/sprites/v4/light',

    sources: {
      osm: OSM_SOURCE,
    },

    layers: layers('osm', flavor, { lang: 'ru' }),
  };
}

export const MAP_STYLES: Readonly<Record<ThemeMode, StyleSpecification>> = {
  light: createStyle(LIGHT),
  dark: createStyle(darkFlavor),
};

import { layers, namedFlavor, type Flavor } from '@protomaps/basemaps';
import type {
  ExpressionSpecification,
  FillExtrusionLayerSpecification,
  StyleSpecification,
} from 'maplibre-gl';

import {
  DEFAULT_BUILDING_HEIGHT,
  MIN_BUILDING_HEIGHT,
  CITY_BUILDING_LAYERS,
  CITY_DETAILS_LAYER,
  CITY_FACADE_SOURCE_LAYER,
  CITY_WINDOW_MIN_ZOOM,
} from '../model/city-details';
import { OSM_SOURCE } from './map-source';
import {
  BRIDGE_DECK_COLOR,
  BRIDGE_DECK_HEIGHT,
  BRIDGE_LAYER_ID,
  BRIDGE_SIDE_COLOR,
  BRIDGE_SOURCE_ID,
} from '../model/bridge-polygons';

/**
 * Объёмная карта в духе глиняного макета: светлая земля, кремовые дороги,
 * бирюзовая вода, зелёные парки и голубовато-серые дома с объёмными окнами и
 * парапетами крыш. География — настоящий OSM-тайл, поэтому палитра и приёмы макета накладываются
 * на реальные кварталы.
 */
const PALETTE = {
  land: '#d9e0de',
  park: '#a9c5ae',
  parkLight: '#b5cbb7',
  water: '#3b94aa',
  road: '#f5f6ef',
  roadEdge: '#e3e6dc',
  roadService: '#e9ebe2',
  bridge: '#fcf3da',
  bridgeEdge: '#d9b975',
  /** Глина: стены домов и более светлые крыши. */
  building: '#99b1c5',
  buildingTall: '#a5bdcf',
  roof: '#a3b9ce',
  roofTall: '#afc4d6',
  vegetation: '#aec9ac',
  vegetationLight: '#bfd1bd',
  pedestrian: '#eef0e7',
  label: '#4c6675',
  labelHalo: '#e8eeea',
  labelMuted: '#6d7f88',
} as const;

/** Цвета эталона поверх светлой темы Protomaps. */
const FLAVOR: Flavor = {
  ...namedFlavor('light'),
  background: PALETTE.land,
  earth: PALETTE.land,
  park_a: PALETTE.parkLight,
  park_b: PALETTE.park,
  wood_a: PALETTE.parkLight,
  wood_b: PALETTE.park,
  scrub_a: PALETTE.vegetationLight,
  scrub_b: PALETTE.vegetation,
  pedestrian: PALETTE.pedestrian,
  hospital: PALETTE.land,
  industrial: PALETTE.land,
  school: PALETTE.land,
  water: PALETTE.water,
  sand: '#e3e0d0',
  beach: '#e8e4d0',
  aerodrome: '#dfe3e2',
  runway: '#e9e9ed',
  zoo: '#c6d7c6',
  military: '#dcdcdc',
  glacier: '#e7e7e7',
  buildings: PALETTE.building,
  minor_service: PALETTE.roadService,
  minor_a: PALETTE.road,
  minor_b: PALETTE.road,
  link: PALETTE.road,
  major: PALETTE.road,
  highway: PALETTE.road,
  other: PALETTE.roadService,
  pier: '#e6e8df',
  railway: '#cfd3c9',
  minor_service_casing: PALETTE.roadEdge,
  minor_casing: PALETTE.roadEdge,
  link_casing: PALETTE.roadEdge,
  major_casing_late: PALETTE.roadEdge,
  major_casing_early: PALETTE.roadEdge,
  highway_casing_late: PALETTE.roadEdge,
  highway_casing_early: PALETTE.roadEdge,
  bridges_other_casing: PALETTE.bridgeEdge,
  bridges_minor_casing: PALETTE.bridgeEdge,
  bridges_link_casing: PALETTE.bridgeEdge,
  bridges_major_casing: PALETTE.bridgeEdge,
  bridges_highway_casing: PALETTE.bridgeEdge,
  bridges_other: PALETTE.bridge,
  bridges_minor: PALETTE.bridge,
  bridges_link: PALETTE.bridge,
  bridges_major: PALETTE.bridge,
  bridges_highway: PALETTE.bridge,
  boundaries: '#c3ccc8',
  roads_label_minor: PALETTE.labelMuted,
  roads_label_minor_halo: PALETTE.road,
  roads_label_major: '#5f737d',
  roads_label_major_halo: PALETTE.road,
  ocean_label: '#2f6e7f',
  subplace_label: PALETTE.labelMuted,
  subplace_label_halo: PALETTE.labelHalo,
  city_label: PALETTE.label,
  city_label_halo: PALETTE.labelHalo,
  state_label: '#84979c',
  state_label_halo: PALETTE.labelHalo,
  country_label: '#84979c',
  address_label: PALETTE.labelMuted,
  address_label_halo: PALETTE.road,
  pois: {
    blue: '#2f7c93',
    green: '#3f7a57',
    lapis: '#315bcf',
    pink: '#ef56ba',
    red: '#f2567a',
    slategray: '#5c6f86',
    tangerine: '#cb6704',
    turquoise: '#00c3d4',
  },
};

/** Высота дома из тайла; без высоты — типовая пятиэтажка эталона. */
const BUILDING_HEIGHT: ExpressionSpecification = [
  'case',
  ['has', 'height'],
  [
    'max',
    MIN_BUILDING_HEIGHT,
    [
      'to-number',
      ['coalesce', ['get', 'height'], DEFAULT_BUILDING_HEIGHT],
      DEFAULT_BUILDING_HEIGHT,
    ],
  ],
  DEFAULT_BUILDING_HEIGHT,
];

/**
 * Слой объёма поверх плоской заливки домов. Свет в стиле даёт тёмные стены
 * и светлую крышу, как у глиняного макета; окна и парапеты — отдельная
 * геометрия `model/city-details.ts`.
 */
const buildings3DLayer: FillExtrusionLayerSpecification = {
  id: CITY_BUILDING_LAYERS[0],
  type: 'fill-extrusion',
  source: 'osm',
  'source-layer': 'buildings',
  minzoom: 12,
  filter: ['in', ['get', 'kind'], ['literal', ['building', 'building_part']]],
  paint: {
    'fill-extrusion-color': [
      'case',
      ['>', BUILDING_HEIGHT, 44],
      PALETTE.buildingTall,
      PALETTE.building,
    ],
    'fill-extrusion-height': BUILDING_HEIGHT,
    'fill-extrusion-base': ['max', 0, ['to-number', ['get', 'min_height'], 0]],
    'fill-extrusion-opacity': 1,
    'fill-extrusion-vertical-gradient': false,
  },
};

/** Светлая плита крыши: верх дома читается как у макета. */
const buildingsRoofLayer: FillExtrusionLayerSpecification = {
  id: 'buildings-3d-roof',
  type: 'fill-extrusion',
  source: 'osm',
  'source-layer': 'buildings',
  minzoom: 13,
  filter: ['in', ['get', 'kind'], ['literal', ['building', 'building_part']]],
  paint: {
    'fill-extrusion-color': [
      'case',
      ['>', BUILDING_HEIGHT, 44],
      PALETTE.roofTall,
      PALETTE.roof,
    ],
    'fill-extrusion-height': ['+', BUILDING_HEIGHT, 0.04],
    'fill-extrusion-base': ['-', BUILDING_HEIGHT, 0.3],
    'fill-extrusion-opacity': 1,
    'fill-extrusion-vertical-gradient': false,
  },
};

/** Мосты: полотно и золотой борт отдельными объёмами. */
export const BRIDGE_FILL_LAYER: FillExtrusionLayerSpecification = {
  id: BRIDGE_LAYER_ID,
  type: 'fill-extrusion',
  source: BRIDGE_SOURCE_ID,
  minzoom: 11,
  paint: {
    'fill-extrusion-color': [
      'match',
      ['get', 'part'],
      'deck',
      BRIDGE_DECK_COLOR,
      BRIDGE_SIDE_COLOR,
    ],
    'fill-extrusion-height': BRIDGE_DECK_HEIGHT,
    'fill-extrusion-base': 0,
    'fill-extrusion-opacity': 1,
    'fill-extrusion-vertical-gradient': false,
  },
};

const BASE_LAYERS = layers('osm', FLAVOR, { lang: 'ru' });

/**
 * Объём домов рисуется после дорог и мостов: иначе кремовые линии дорог
 * ложатся поверх стен (2D-слои не знают о высоте). Подписи остаются выше.
 */
const LABELS_INDEX = BASE_LAYERS.findIndex((layer) => layer.type === 'symbol');

const facadeTileJSON = process.env.EXPO_PUBLIC_MAP_FACADES_TILEJSON_URL;
export const USE_PREPARED_FACADES = Boolean(facadeTileJSON);

const preparedDetailsLayer: FillExtrusionLayerSpecification = {
  ...CITY_DETAILS_LAYER,
  id: 'buildings-prepared-details',
  source: 'osm',
  'source-layer': CITY_FACADE_SOURCE_LAYER,
  minzoom: CITY_WINDOW_MIN_ZOOM,
};

export const MAP_3D_STYLE: StyleSpecification = {
  version: 8,
  name: 'DoneReceived 3D',
  glyphs:
    'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
  sprite: 'https://protomaps.github.io/basemaps-assets/sprites/v4/light',
  // Мягкий рассеянный свет: кровли светлее стен.
  light: {
    anchor: 'map',
    color: '#ffffff',
    intensity: 0.38,
    position: [1.15, 210, 30],
  },
  sources: {
    osm: facadeTileJSON ? { ...OSM_SOURCE, url: facadeTileJSON } : OSM_SOURCE,
  },
  layers: [
    ...BASE_LAYERS.slice(0, LABELS_INDEX),
    buildings3DLayer,
    buildingsRoofLayer,
    ...(USE_PREPARED_FACADES ? [preparedDetailsLayer] : []),
    ...BASE_LAYERS.slice(LABELS_INDEX),
  ],
};

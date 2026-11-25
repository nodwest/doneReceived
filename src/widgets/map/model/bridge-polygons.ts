import type {
  Feature,
  FeatureCollection,
  LineString,
  MultiLineString,
  Polygon,
  Position,
} from 'geojson';

/**
 * Мосты в схеме 3D-карты: полотно и боковые стенки. MapLibre умеет объём
 * только у полигонов, поэтому линии мостов из OSM разворачиваем в полосы:
 * широкая — проезжая часть цвета эталона, две узкие по краям — золотой борт.
 */

/** Слои мостов в базовой стилизации Protomaps. */
export const BRIDGE_LAYER_IDS = [
  'roads_bridges_highway',
  'roads_bridges_major',
  'roads_bridges_minor',
  'roads_bridges_link',
  'roads_bridges_other',
] as const;

export const BRIDGE_SOURCE_ID = 'map-bridges';
export const BRIDGE_LAYER_ID = 'map-bridges-3d';
export const BRIDGE_DECK_COLOR = '#fcf3da';
export const BRIDGE_SIDE_COLOR = '#d9b975';
export const BRIDGE_DECK_HEIGHT = 4.5;

/** Ширина моста по классу дороги, метры. */
const bridgeWidth = (feature: Feature): number => {
  const kind = String(feature.properties?.kind ?? '');
  if (kind === 'highway') return 10;
  if (kind === 'major_road') return 9;
  if (kind === 'minor_road') return 7;
  if (kind === 'other' || kind === 'path') return 3.5;
  return 6;
};

const METERS_PER_DEGREE = 111_320;

type BridgeProperties = { part: 'deck' | 'side' };

const isPosition = (value: unknown): value is Position =>
  Array.isArray(value) &&
  value.length >= 2 &&
  typeof value[0] === 'number' &&
  typeof value[1] === 'number';

const linesOf = (feature: Feature): Position[][] => {
  const geometry = feature.geometry;
  if (!geometry) return [];
  if (geometry.type === 'LineString')
    return [(geometry as LineString).coordinates];
  if (geometry.type === 'MultiLineString')
    return (geometry as MultiLineString).coordinates;
  return [];
};

const ring = (points: Position[]): Position[] =>
  points.length > 0 ? [...points, points[0]] : points;

/**
 * Полосы мостов по реальным линиям: полотно на высоте и боковые борта.
 * Если линии короткие или битые — просто пропускаем сегмент.
 */
export function bridgePolygons(
  features: readonly Feature[],
): FeatureCollection<Polygon, BridgeProperties> {
  const polygons: Feature<Polygon, BridgeProperties>[] = [];

  for (const feature of features) {
    if (polygons.length > 4000) break;
    const width = bridgeWidth(feature);
    for (const line of linesOf(feature)) {
      for (let index = 1; index < line.length; index += 1) {
        if (polygons.length > 4000) break;
        const from = line[index - 1];
        const to = line[index];
        if (!isPosition(from) || !isPosition(to)) continue;
        const [lng1, lat1] = from;
        const [lng2, lat2] = to;
        const midLat = (lat1 + lat2) / 2;
        const metersLng =
          METERS_PER_DEGREE * Math.cos((midLat * Math.PI) / 180);
        const dx = (lng2 - lng1) * metersLng;
        const dy = (lat2 - lat1) * METERS_PER_DEGREE;
        const length = Math.hypot(dx, dy);
        if (length < 4) continue;

        // Нормаль в метрах, затем обратно в градусы.
        const nx = (-dy / length) * (width / 2);
        const ny = (dx / length) * (width / 2);
        const offsetLng = (value: number) => value / metersLng;
        const offsetLat = (value: number) => value / METERS_PER_DEGREE;

        const left1: Position = [lng1 + offsetLng(nx), lat1 + offsetLat(ny)];
        const left2: Position = [lng2 + offsetLng(nx), lat2 + offsetLat(ny)];
        const right1: Position = [lng1 - offsetLng(nx), lat1 - offsetLat(ny)];
        const right2: Position = [lng2 - offsetLng(nx), lat2 - offsetLat(ny)];
        polygons.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [ring([left1, left2, right2, right1])],
          },
          properties: { part: 'deck' },
        });

        // Борт: тонкая полоса снаружи полотна, из неё объём даёт край.
        const border = 1.4;
        const bx = (-dy / length) * border;
        const by = (dx / length) * border;
        const outerLeft1: Position = [
          lng1 + offsetLng(nx + bx),
          lat1 + offsetLat(ny + by),
        ];
        const outerLeft2: Position = [
          lng2 + offsetLng(nx + bx),
          lat2 + offsetLat(ny + by),
        ];
        const outerRight1: Position = [
          lng1 - offsetLng(nx - bx),
          lat1 - offsetLat(ny - by),
        ];
        const outerRight2: Position = [
          lng2 - offsetLng(nx - bx),
          lat2 - offsetLat(ny - by),
        ];
        polygons.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [ring([left1, left2, outerLeft2, outerLeft1])],
          },
          properties: { part: 'side' },
        });
        polygons.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [ring([outerRight1, outerRight2, right2, right1])],
          },
          properties: { part: 'side' },
        });
      }
    }
  }

  return { type: 'FeatureCollection', features: polygons };
}

export const EMPTY_BRIDGES: FeatureCollection<Polygon, BridgeProperties> = {
  type: 'FeatureCollection',
  features: [],
};

export type BridgeFeature = Feature<Polygon, BridgeProperties>;

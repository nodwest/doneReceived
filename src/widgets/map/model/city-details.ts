import type { Feature, FeatureCollection, Polygon, Position } from 'geojson';
import type { FillExtrusionLayerSpecification } from 'maplibre-gl';

export const CITY_DETAILS_SOURCE_ID = 'map-city-details';
export const CITY_DETAILS_LAYER_ID = 'map-city-details-3d';

/** Исходные слои стиля: дома и зелёные зоны. */
export const CITY_BUILDING_LAYERS = ['buildings-3d'] as const;
export const CITY_PARK_LAYERS = [
  'landuse_park',
  'landuse_urban_green',
  'landcover',
] as const;

/** Декор рисуется только рядом: на мелком масштабе он не читается. */
export const CITY_WINDOW_MIN_ZOOM = 16;
export const CITY_TREE_MIN_ZOOM = 13.5;
export const CITY_TREE_MAX_COUNT = 40;
export const CITY_FACADE_SOURCE_LAYER = 'dr_facades';
export const CITY_WINDOW_MAX_COUNT = 20000;
export const CITY_PARAPET_MAX_COUNT = 8000;

export type CityDetailKind =
  | 'window'
  | 'window-lit'
  | 'tree-crown-base'
  | 'parapet'
  | 'roof-equipment'
  | 'antenna'
  | 'tree-trunk'
  | 'tree-crown'
  | 'tree-crown-top';

export type CityDetailProperties = {
  kind: CityDetailKind;
  /** Нижняя отметка объёма, метры над землёй. */
  base: number;
  /** Верхняя отметка объёма, метры над землёй. */
  top: number;
};

export type CityDetails = {
  windows: FeatureCollection<Polygon, CityDetailProperties>;
  parapets: FeatureCollection<Polygon, CityDetailProperties>;
  trees: FeatureCollection<Polygon, CityDetailProperties>;
  /** Сколько всего полигонов, для ограничения и диагностики. */
  count: number;
};

const COLORS: Record<CityDetailKind, string> = {
  window: '#59758d',
  'window-lit': '#f2d396',
  parapet: '#bccddd',
  'roof-equipment': '#a0b7cc',
  antenna: '#718da4',
  'tree-trunk': '#78694f',
  'tree-crown-base': '#577c65',
  'tree-crown': '#719678',
  'tree-crown-top': '#91b18a',
};

const EMPTY: FeatureCollection<Polygon, CityDetailProperties> = {
  type: 'FeatureCollection',
  features: [],
};

/** Один слой на все детали: цвет, низ и верх берутся из свойств полигона. */
export const CITY_DETAILS_LAYER: FillExtrusionLayerSpecification = {
  id: CITY_DETAILS_LAYER_ID,
  type: 'fill-extrusion',
  source: CITY_DETAILS_SOURCE_ID,
  minzoom: 13,
  paint: {
    'fill-extrusion-color': [
      'match',
      ['get', 'kind'],
      'window',
      COLORS.window,
      'window-lit',
      COLORS['window-lit'],
      'parapet',
      COLORS.parapet,
      'roof-equipment',
      COLORS['roof-equipment'],
      'antenna',
      COLORS.antenna,
      'tree-trunk',
      COLORS['tree-trunk'],
      'tree-crown-base',
      COLORS['tree-crown-base'],
      'tree-crown',
      COLORS['tree-crown'],
      COLORS['tree-crown-top'],
    ],
    'fill-extrusion-base': ['get', 'base'],
    'fill-extrusion-height': ['get', 'top'],
    'fill-extrusion-opacity': 1,
    'fill-extrusion-vertical-gradient': false,
  },
};

const METERS_PER_DEGREE = 111_320;
const WINDOW_STEP_METERS = 4.2;
const WINDOW_WIDTH_METERS = 1.5;
const WINDOW_HEIGHT_METERS = 1.7;
const FLOOR_HEIGHT_METERS = 3.2;
const WINDOW_DEPTH_METERS = 0.48;
const WINDOW_OFFSET_METERS = -0.14;
// Protomaps pads its 4096-unit vector tiles by 64 units on each side.
const BUILDING_TILE_EXTENT = 4096;
const BUILDING_TILE_BUFFER = 64;
const BUILDING_TILE_ZOOMS = [12, 13, 14, 15];

const PARAPET_WIDTH_METERS = 0.4;
const PARAPET_HEIGHT_METERS = 0.5;
// Radius and height for successive slices of an ovoid crown.
const TREE_CROWN = [
  [0.56, 0.28, 0.39, 'tree-crown-base'],
  [0.83, 0.39, 0.5, 'tree-crown-base'],
  [1, 0.5, 0.66, 'tree-crown'],
  [0.92, 0.66, 0.79, 'tree-crown'],
  [0.73, 0.79, 0.9, 'tree-crown-top'],
  [0.44, 0.9, 1, 'tree-crown-top'],
] as const;
/** Шаг глобальной сетки деревьев в градусах: узлы не зависят от вида. */
const TREE_GRID_LAT = 0.0003;
const TREE_GRID_LNG = 0.00042;
const TREE_KEEP_PERCENT = 55;

const isPosition = (value: unknown): value is Position =>
  Array.isArray(value) &&
  value.length >= 2 &&
  typeof value[0] === 'number' &&
  typeof value[1] === 'number';

const outerRings = (feature: Feature): Position[][] => {
  const geometry = feature.geometry;
  if (!geometry) return [];
  const polygons: Position[][][] =
    geometry.type === 'Polygon'
      ? [geometry.coordinates]
      : geometry.type === 'MultiPolygon'
        ? geometry.coordinates
        : [];
  return polygons
    .map((rings) => rings[0])
    .filter((ring): ring is Position[] => Boolean(ring) && ring.length >= 4);
};

export const DEFAULT_BUILDING_HEIGHT = 14;
export const MIN_BUILDING_HEIGHT = 4;

const buildingHeight = (feature: Feature): number => {
  const height = Number(feature.properties?.height ?? DEFAULT_BUILDING_HEIGHT);
  return Math.max(
    MIN_BUILDING_HEIGHT,
    Number.isFinite(height) ? height : DEFAULT_BUILDING_HEIGHT,
  );
};

const insideRing = (lng: number, lat: number, ring: Position[]) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const a = ring[i];
    const b = ring[j];
    if (!isPosition(a) || !isPosition(b)) continue;
    if (
      a[1] > lat !== b[1] > lat &&
      lng < ((b[0] - a[0]) * (lat - a[1])) / (b[1] - a[1]) + a[0]
    )
      inside = !inside;
  }
  return inside;
};

const feature = (
  ring: Position[],
  kind: CityDetailKind,
  base: number,
  top: number,
): Feature<Polygon, CityDetailProperties> => ({
  type: 'Feature',
  geometry: { type: 'Polygon', coordinates: [ring] },
  properties: { kind, base: Math.max(0, base), top: Math.max(0, top) },
});

const closeRing = (ring: Position[]): Position[] => [...ring, ring[0]];

/** Дом в локальных метрах: удобно резать стены на окна и парапеты. */
type Wall = {
  /** Начало стены в lng/lat. */
  from: [number, number];
  /** Конец стены в lng/lat. */
  to: [number, number];
  /** Длина в метрах. */
  length: number;
  /** Внешняя нормаль в метрах (единичная). */
  normal: [number, number];
};

function isTileCut(from: Position, to: Position): boolean {
  // Buildings clipped at a tile edge acquire a north/south or east/west
  // segment at the tile's buffer boundary. It is not a building wall.
  const precision = 0.00000015;
  const axis =
    Math.abs(from[0] - to[0]) < precision
      ? 0
      : Math.abs(from[1] - to[1]) < precision
        ? 1
        : -1;
  if (axis < 0) return false;

  const degrees = (from[axis] + to[axis]) / 2;
  const radians = (degrees * Math.PI) / 180;
  const mercator =
    axis === 0
      ? (degrees + 180) / 360
      : (1 - Math.asinh(Math.tan(radians)) / Math.PI) / 2;
  return BUILDING_TILE_ZOOMS.some((zoom) => {
    const units = mercator * 2 ** zoom * BUILDING_TILE_EXTENT;
    const position =
      units - Math.round(units / BUILDING_TILE_EXTENT) * BUILDING_TILE_EXTENT;
    return (
      Math.abs(position) < 0.08 ||
      Math.abs(Math.abs(position) - BUILDING_TILE_BUFFER) < 0.08
    );
  });
}

function wallsOf(ring: Position[], metersLng: number): Wall[] {
  const points = ring.filter(isPosition);
  let area = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    area += points[j][0] * points[i][1] - points[i][0] * points[j][1];
  }
  const counterClockwise = area > 0;

  const walls: Wall[] = [];
  for (let index = 0; index < points.length; index += 1) {
    const start = points[index];
    const end = points[(index + 1) % points.length];
    if (isTileCut(start, end)) continue;
    const ax = start[0] * metersLng;
    const ay = start[1] * METERS_PER_DEGREE;
    const bx = end[0] * metersLng;
    const by = end[1] * METERS_PER_DEGREE;
    const dx = bx - ax;
    const dy = by - ay;
    const length = Math.hypot(dx, dy);
    if (length < 0.1) continue;
    const direction = counterClockwise ? 1 : -1;
    const nx = (direction * dy) / length;
    const ny = (-direction * dx) / length;
    const wall: Wall = {
      from: [start[0], start[1]],
      to: [end[0], end[1]],
      length,
      normal: [nx, ny],
    };
    // Simplified rings can go out and back along a zero-area edge.
    // A drawable wall must actually have occupied floor area behind it.
    const inside = [0.15, 0.5, 0.85].some((fraction) => {
      const [lng, lat] = wallQuad(
        wall,
        length * fraction,
        -0.2,
        0,
        0,
        metersLng,
      )[0];
      return insideRing(lng, lat, ring);
    });
    if (inside) walls.push(wall);
  }
  return walls;
}

/** Четырёхугольник на стене: сдвиг по стене и наружу, высота — объёмом. */
function wallQuad(
  wall: Wall,
  offsetMeters: number,
  outwardMeters: number,
  widthMeters: number,
  depthMeters: number,
  metersLng: number,
): Position[] {
  const [ax, ay] = wall.from;
  const [bx, by] = wall.to;
  const dx = (bx - ax) * metersLng;
  const dy = (by - ay) * METERS_PER_DEGREE;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const [nx, ny] = wall.normal;
  const point = (along: number, out: number): Position => [
    ax + (ux * along + nx * out) / metersLng,
    ay + (uy * along + ny * out) / METERS_PER_DEGREE,
  ];
  return [
    point(offsetMeters, outwardMeters),
    point(offsetMeters + widthMeters, outwardMeters),
    point(offsetMeters + widthMeters, outwardMeters + depthMeters),
    point(offsetMeters, outwardMeters + depthMeters),
  ];
}

function windowKind(wall: Wall, floor: number, column: number): CityDetailKind {
  const [lng, lat] = wall.from;
  const seed =
    Math.imul(Math.round(lng * 1e6), 73856093) ^
    Math.imul(Math.round(lat * 1e6), 19349663) ^
    Math.imul(floor + 1, 83492791) ^
    Math.imul(column + 1, 2654435761);
  return (seed >>> 0) % 19 === 0 ? 'window-lit' : 'window';
}

function windowsOfBuilding(
  walls: Wall[],
  height: number,
  minHeight: number,
  metersLng: number,
): Feature<Polygon, CityDetailProperties>[] {
  const span = height - minHeight;
  if (span < 3) return [];
  const floors = Math.min(
    32,
    Math.max(1, Math.floor(span / FLOOR_HEIGHT_METERS)),
  );
  const floorStep = span / floors;
  const windows: Feature<Polygon, CityDetailProperties>[] = [];
  for (const wall of walls) {
    if (wall.length < 3) continue;
    const columns = Math.max(1, Math.round(wall.length / WINDOW_STEP_METERS));
    const columnStep = wall.length / columns;
    for (let floor = 0; floor < floors; floor += 1) {
      const base = minHeight + (floor + 0.28) * floorStep;
      const top = base + Math.min(WINDOW_HEIGHT_METERS, floorStep * 0.5);
      for (let column = 0; column < columns; column += 1) {
        const offset = (column + 0.5) * columnStep - WINDOW_WIDTH_METERS / 2;
        windows.push(
          feature(
            closeRing(
              wallQuad(
                wall,
                offset,
                WINDOW_OFFSET_METERS,
                WINDOW_WIDTH_METERS,
                WINDOW_DEPTH_METERS,
                metersLng,
              ),
            ),
            windowKind(wall, floor, column),
            base,
            top,
          ),
        );
      }
    }
  }
  return windows;
}

function roofDetails(
  ring: Position[],
  walls: Wall[],
  height: number,
  metersLng: number,
  seed: number,
): Feature<Polygon, CityDetailProperties>[] {
  const details: Feature<Polygon, CityDetailProperties>[] = [];
  const trimHeight = PARAPET_HEIGHT_METERS + (seed % 3) * 0.2;
  for (const wall of walls) {
    if (wall.length < 1) continue;
    details.push(
      feature(
        closeRing(
          wallQuad(
            wall,
            0,
            -PARAPET_WIDTH_METERS,
            wall.length,
            PARAPET_WIDTH_METERS,
            metersLng,
          ),
        ),
        'parapet',
        height,
        height + trimHeight,
      ),
    );
  }

  // A partial roof can be represented in more than one tile. Only place
  // equipment when we have a complete footprint to anchor it to.
  if (
    ring.some((point, index) => index > 0 && isTileCut(ring[index - 1], point))
  ) {
    return details;
  }

  const variant = seed % 7;
  const wall = walls.reduce<Wall | undefined>(
    (longest, next) =>
      !longest || next.length > longest.length ? next : longest,
    undefined,
  );
  if (!wall || wall.length < 7 || variant === 0) return details;

  const width = variant < 3 ? 3.2 : 2;
  const depth = variant < 3 ? 2.8 : 1.8;
  const center = wall.length * (0.3 + ((seed >>> 8) % 40) / 100);
  const placement = [3.4, 6, 9].find((inset) => {
    const clearance = wallQuad(
      wall,
      center - width / 2 - 0.5,
      -inset - depth - 0.5,
      width + 1,
      depth + 1,
      metersLng,
    );
    return clearance.every(([lng, lat]) => insideRing(lng, lat, ring));
  });
  if (placement === undefined) return details;

  const add = (
    offset: number,
    inset: number,
    w: number,
    d: number,
    kind: CityDetailKind,
    base: number,
    top: number,
  ) => {
    details.push(
      feature(
        closeRing(
          wallQuad(wall, center + offset, -placement + inset, w, d, metersLng),
        ),
        kind,
        height + base,
        height + top,
      ),
    );
  };

  if (variant <= 2) {
    add(
      -width / 2,
      -depth,
      width,
      depth,
      'roof-equipment',
      0,
      variant === 1 ? 1.6 : 2.3,
    );
  } else if (variant <= 4) {
    add(-1, -1.8, 0.8, 1.6, 'roof-equipment', 0, 0.9);
    add(0.2, -1.8, 0.8, 1.6, 'roof-equipment', 0, 1.1);
  } else {
    const mastHeight = variant === 5 ? 2.5 : 3.4;
    add(-0.65, -1.5, 1.3, 1.3, 'roof-equipment', 0, 0.5);
    add(-0.23, -1.1, 0.46, 0.46, 'antenna', 0.5, mastHeight);
    add(-1, -1.05, 2, 0.36, 'antenna', mastHeight - 0.6, mastHeight - 0.25);
    if (variant === 6) {
      add(-0.19, -1.8, 0.38, 1.8, 'antenna', mastHeight - 0.35, mastHeight);
    }
  }
  return details;
}

function degToMeters(lat: number) {
  return {
    lng: METERS_PER_DEGREE * Math.cos((lat * Math.PI) / 180),
    lat: METERS_PER_DEGREE,
  };
}

function crownRing(
  lng: number,
  lat: number,
  radiusMeters: number,
  metersLng: number,
): Position[] {
  const ring: Position[] = [];
  for (let index = 0; index < 10; index += 1) {
    const angle = (Math.PI / 5) * index;
    ring.push([
      lng + (Math.cos(angle) * radiusMeters) / metersLng,
      lat + (Math.sin(angle) * radiusMeters) / METERS_PER_DEGREE,
    ]);
  }
  return closeRing(ring);
}

function square(
  lng: number,
  lat: number,
  radiusMeters: number,
  metersLng: number,
): Position[] {
  return closeRing([
    [lng - radiusMeters / metersLng, lat - radiusMeters / METERS_PER_DEGREE],
    [lng + radiusMeters / metersLng, lat - radiusMeters / METERS_PER_DEGREE],
    [lng + radiusMeters / metersLng, lat + radiusMeters / METERS_PER_DEGREE],
    [lng - radiusMeters / metersLng, lat + radiusMeters / METERS_PER_DEGREE],
  ]);
}

function treesInParks(
  parks: readonly Feature[],
  bounds?: CityBounds,
): Feature<Polygon, CityDetailProperties>[] {
  const trees: Feature<Polygon, CityDetailProperties>[] = [];
  const used = new Set<string>();

  for (const park of parks) {
    for (const ring of outerRings(park)) {
      let minLng = Infinity;
      let maxLng = -Infinity;
      let minLat = Infinity;
      let maxLat = -Infinity;
      for (const point of ring) {
        if (!isPosition(point)) continue;
        minLng = Math.min(minLng, point[0]);
        maxLng = Math.max(maxLng, point[0]);
        minLat = Math.min(minLat, point[1]);
        maxLat = Math.max(maxLat, point[1]);
      }
      if (!Number.isFinite(minLng) || !Number.isFinite(minLat)) continue;

      // Узлы глобальной сетки: один и тот же узел даёт одно и то же дерево
      // в любом положении карты.
      if (bounds && bounds[0] <= bounds[2]) {
        minLng = Math.max(minLng, bounds[0] - TREE_GRID_LNG);
        maxLng = Math.min(maxLng, bounds[2] + TREE_GRID_LNG);
      }
      if (bounds) {
        minLat = Math.max(minLat, bounds[1] - TREE_GRID_LAT);
        maxLat = Math.min(maxLat, bounds[3] + TREE_GRID_LAT);
      }
      const startI = Math.ceil(minLng / TREE_GRID_LNG);
      const endI = Math.floor(maxLng / TREE_GRID_LNG);
      const startJ = Math.ceil(minLat / TREE_GRID_LAT);
      const endJ = Math.floor(maxLat / TREE_GRID_LAT);
      for (let i = startI; i <= endI; i += 1) {
        if (used.size >= CITY_TREE_MAX_COUNT) break;
        for (let j = startJ; j <= endJ; j += 1) {
          if (used.size >= CITY_TREE_MAX_COUNT) break;
          const key = `${i}:${j}`;
          if (used.has(key)) continue;
          const hash = Math.imul(i, 73856093) ^ Math.imul(j, 19349663);
          const bucket = ((hash >>> 0) % 1000) / 10;
          if (bucket > TREE_KEEP_PERCENT) continue;
          const jitter = ((hash >>> 8) & 255) / 255 - 0.5;
          const lng = i * TREE_GRID_LNG + jitter * TREE_GRID_LNG * 0.5;
          const lat = j * TREE_GRID_LAT + jitter * TREE_GRID_LAT * 0.5;
          if (!insideRing(lng, lat, ring)) continue;
          used.add(key);
          const metersLng = degToMeters(lat).lng;
          const height = 3.6 + ((hash >>> 16) & 255) * (4.2 / 255);
          const radius = height * (0.22 + ((hash >>> 24) & 15) / 350);
          trees.push(
            feature(
              square(lng, lat, height * 0.028, metersLng),
              'tree-trunk',
              0,
              height * 0.38,
            ),
          );
          for (const [width, base, top, kind] of TREE_CROWN) {
            trees.push(
              feature(
                crownRing(lng, lat, radius * width, metersLng),
                kind,
                height * base,
                height * top,
              ),
            );
          }
        }
      }
    }
    if (used.size >= CITY_TREE_MAX_COUNT) break;
  }

  return trees;
}

const buildingCache = new Map<
  string,
  {
    windows: Feature<Polygon, CityDetailProperties>[];
    parapets: Feature<Polygon, CityDetailProperties>[];
  }
>();
const BUILDING_CACHE_LIMIT = 1500;

function hashBuilding(key: string): number {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash = Math.imul(hash ^ key.charCodeAt(index), 16777619);
  }
  return hash >>> 0;
}

type CityBounds = readonly [
  west: number,
  south: number,
  east: number,
  north: number,
];

function ringIntersectsView(
  ring: Position[],
  bounds: CityBounds,
  height: number,
): boolean {
  const [west, south, rawEast, north] = bounds;
  const east = rawEast < west ? rawEast + 360 : rawEast;
  const centerLng = (west + east) / 2;
  const wrap = Math.round((centerLng - ring[0][0]) / 360) * 360;
  // Extruded roofs can enter the frame before their footprint does.
  const padding = 16 + height * 2;
  const latPadding = padding / METERS_PER_DEGREE;
  const lngPadding =
    padding / Math.max(1, degToMeters((south + north) / 2).lng);

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const [lng, lat] of ring) {
    minLng = Math.min(minLng, lng + wrap);
    maxLng = Math.max(maxLng, lng + wrap);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }
  return (
    maxLng >= west - lngPadding &&
    minLng <= east + lngPadding &&
    maxLat >= south - latPadding &&
    minLat <= north + latPadding
  );
}

const ROOF_GRID_DEGREES = 0.001;

type RoofFootprint = { ring: Position[]; height: number };

function indexRoof(index: Map<string, RoofFootprint[]>, roof: RoofFootprint) {
  const bounds = roof.ring.reduce(
    ([west, south, east, north], [lng, lat]) => [
      Math.min(west, lng),
      Math.min(south, lat),
      Math.max(east, lng),
      Math.max(north, lat),
    ],
    [Infinity, Infinity, -Infinity, -Infinity],
  );
  const [west, south, east, north] = bounds.map((value) =>
    Math.floor(value / ROOF_GRID_DEGREES),
  );
  for (let x = west; x <= east; x += 1) {
    for (let y = south; y <= north; y += 1) {
      const key = `${x}:${y}`;
      const roofs = index.get(key);
      if (roofs) roofs.push(roof);
      else index.set(key, [roof]);
    }
  }
}

function visibleParapet(
  detail: Feature<Polygon, CityDetailProperties>,
  roofs: Map<string, RoofFootprint[]>,
): Feature<Polygon, CityDetailProperties>[] {
  if (detail.properties.kind !== 'parapet') return [detail];

  const [innerStart, innerEnd, outerEnd, outerStart] =
    detail.geometry.coordinates[0];
  const dx = outerStart[0] - innerStart[0];
  const dy = outerStart[1] - innerStart[1];
  const along = (
    start: Position,
    end: Position,
    fraction: number,
  ): Position => [
    start[0] + (end[0] - start[0]) * fraction,
    start[1] + (end[1] - start[1]) * fraction,
  ];
  const length = Math.hypot(
    (outerEnd[0] - outerStart[0]) * degToMeters(outerStart[1]).lng,
    (outerEnd[1] - outerStart[1]) * METERS_PER_DEGREE,
  );
  const sections = Math.max(1, Math.ceil(length / 1.5));
  const visible = [];
  let runStart = 0;
  for (let index = 0; index <= sections; index += 1) {
    const [x, y] = along(outerStart, outerEnd, (index + 0.5) / sections);
    const lng = x + dx;
    const lat = y + dy;
    const cell = `${Math.floor(lng / ROOF_GRID_DEGREES)}:${Math.floor(lat / ROOF_GRID_DEGREES)}`;
    const covered =
      index === sections ||
      roofs
        .get(cell)
        ?.some(
          (roof) =>
            roof.height + 0.002 >= detail.properties.base &&
            insideRing(lng, lat, roof.ring),
        );
    if (!covered) continue;
    if (index > runStart) {
      const from = runStart / sections;
      const to = index / sections;
      visible.push(
        feature(
          closeRing([
            along(innerStart, innerEnd, from),
            along(innerStart, innerEnd, to),
            along(outerStart, outerEnd, to),
            along(outerStart, outerEnd, from),
          ]),
          'parapet',
          detail.properties.base,
          detail.properties.top,
        ),
      );
    }
    runStart = index + 1;
  }
  return visible;
}

export function buildCityDetails(
  buildings: readonly Feature[],
  parks: readonly Feature[],
  zoom: number,
  bounds?: CityBounds,
  windowLimit = CITY_WINDOW_MAX_COUNT,
  cacheBuildings = true,
): CityDetails {
  const windowGroups: Feature<Polygon, CityDetailProperties>[][] = [];
  let windowCount = 0;
  const parapets: Feature<Polygon, CityDetailProperties>[] = [];
  const trees = zoom >= CITY_TREE_MIN_ZOOM ? treesInParks(parks, bounds) : [];
  const roofs = new Map<string, RoofFootprint[]>();

  if (zoom >= CITY_WINDOW_MIN_ZOOM) {
    const seen = new Set<string>();
    for (const building of buildings) {
      const height = buildingHeight(building);
      const minHeight = Math.max(
        0,
        Number(building.properties?.min_height) || 0,
      );
      for (const ring of outerRings(building)) {
        // One Protomaps feature can contain hundreds of separate buildings.
        if (bounds && !ringIntersectsView(ring, bounds, height)) continue;
        // Tile buffers can return the same polygon twice, or different clipped
        // fragments of one building. Cache the actual outline of each fragment.
        const outline = JSON.stringify(
          ring
            .slice(0, -1)
            .map((point) => point.join(','))
            .sort(),
        );
        const id = building.id || undefined;
        const key = JSON.stringify([id, outline, height, minHeight]);
        if (seen.has(key)) continue;
        seen.add(key);
        indexRoof(roofs, { ring, height: height + 0.04 });

        let cached = cacheBuildings ? buildingCache.get(key) : undefined;
        if (!cached) {
          const metersLng = degToMeters(ring[0][1]).lng;
          const walls = wallsOf(ring, metersLng);
          cached = {
            windows: windowsOfBuilding(walls, height, minHeight, metersLng),
            parapets: roofDetails(
              ring,
              walls,
              height + 0.04,
              metersLng,
              hashBuilding(outline),
            ),
          };
          if (cacheBuildings) {
            if (buildingCache.size >= BUILDING_CACHE_LIMIT) {
              const oldest = buildingCache.keys().next().value;
              if (oldest !== undefined) buildingCache.delete(oldest);
            }
            buildingCache.set(key, cached);
          }
        }

        if (cached.windows.length > 0) {
          windowGroups.push(cached.windows);
          windowCount += cached.windows.length;
        }
        for (const detail of cached.parapets) {
          if (parapets.length >= CITY_PARAPET_MAX_COUNT) break;
          parapets.push(detail);
        }
      }
    }
  }

  // Share the budget across footprints, including buildings at the end
  // of a grouped vector feature.
  const density = Math.min(1, windowLimit / Math.max(1, windowCount));
  const windows: Feature<Polygon, CityDetailProperties>[] = [];
  let processed = 0;
  for (const group of windowGroups) {
    const quota =
      Math.floor((processed + group.length) * density) -
      Math.floor(processed * density);
    processed += group.length;
    for (let index = 0; index < quota; index += 1) {
      windows.push(group[Math.floor(((index + 0.5) * group.length) / quota)]);
    }
  }

  const visibleParapets = parapets.flatMap((detail) =>
    visibleParapet(detail, roofs),
  );

  return {
    windows: { type: 'FeatureCollection', features: windows },
    parapets: { type: 'FeatureCollection', features: visibleParapets },
    trees: { type: 'FeatureCollection', features: trees },
    count: windows.length + visibleParapets.length + trees.length,
  };
}

export const EMPTY_CITY_DETAILS: CityDetails = {
  windows: EMPTY,
  parapets: EMPTY,
  trees: EMPTY,
  count: 0,
};

/** Все детали одним FeatureCollection для одного GeoJSON-источника. */
export function cityDetailsSource(
  details: CityDetails,
): FeatureCollection<Polygon, CityDetailProperties> {
  return {
    type: 'FeatureCollection',
    features: [
      ...details.windows.features,
      ...details.parapets.features,
      ...details.trees.features,
    ],
  };
}

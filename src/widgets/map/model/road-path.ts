import type { GeoJSONFeature, Map as MapLibreMap } from 'maplibre-gl';

export type RoadPoint = [number, number];

type Edge = { node: number; distance: number };
type Node = { point: RoadPoint; edges: Edge[] };
type Segment = { a: number; b: number; distance: number };
type Snap = {
  point: RoadPoint;
  segment: number;
  fraction: number;
  distance: number;
};

const ROAD_SOURCE = 'osm';
const ROAD_LAYER = 'roads';
const GRID_SIZE = 0.002;
const MAX_SNAP_METERS = 80;
const MAX_VISITED_NODES = 6_000;
const EARTH_METERS_PER_DEGREE = 111_320;
const ROUTABLE_KINDS = new Set([
  'highway',
  'major_road',
  'medium_road',
  'minor_road',
  'other',
]);

function metersBetween(a: RoadPoint, b: RoadPoint) {
  const latitude = ((a[1] + b[1]) / 2) * (Math.PI / 180);
  const east = (b[0] - a[0]) * Math.cos(latitude) * EARTH_METERS_PER_DEGREE;
  const north = (b[1] - a[1]) * EARTH_METERS_PER_DEGREE;
  return Math.hypot(east, north);
}

function nodeKey(point: RoadPoint) {
  return `${point[0].toFixed(6)},${point[1].toFixed(6)}`;
}

function gridKey(x: number, y: number) {
  return `${x},${y}`;
}

function project(point: RoadPoint, a: RoadPoint, b: RoadPoint) {
  const latitude = point[1] * (Math.PI / 180);
  const scale = Math.max(0.2, Math.cos(latitude));
  const ax = (a[0] - point[0]) * scale;
  const ay = a[1] - point[1];
  const bx = (b[0] - point[0]) * scale;
  const by = b[1] - point[1];
  const dx = bx - ax;
  const dy = by - ay;
  const denominator = dx * dx + dy * dy;
  const fraction =
    denominator === 0
      ? 0
      : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / denominator));
  const snapped: RoadPoint = [
    a[0] + (b[0] - a[0]) * fraction,
    a[1] + (b[1] - a[1]) * fraction,
  ];
  return { point: snapped, fraction, distance: metersBetween(point, snapped) };
}

function lines(feature: GeoJSONFeature): RoadPoint[][] {
  const geometry = feature.geometry;
  if (!geometry) return [];
  if (geometry.type === 'LineString') {
    return [geometry.coordinates as RoadPoint[]];
  }
  if (geometry.type === 'MultiLineString') {
    return geometry.coordinates as RoadPoint[][];
  }
  return [];
}

function isRoutable(feature: GeoJSONFeature) {
  const kind = feature.properties?.kind;
  return typeof kind !== 'string' || ROUTABLE_KINDS.has(kind);
}

class MinHeap {
  private values: [number, number][] = [];

  push(value: [number, number]) {
    let index = this.values.push(value) - 1;
    while (index > 0) {
      const parent = (index - 1) >>> 1;
      if (this.values[parent][0] <= value[0]) break;
      this.values[index] = this.values[parent];
      index = parent;
    }
    this.values[index] = value;
  }

  pop() {
    const first = this.values[0];
    const last = this.values.pop();
    if (!first || !last || this.values.length === 0) return first;
    let index = 0;
    while (true) {
      const left = index * 2 + 1;
      if (left >= this.values.length) break;
      const right = left + 1;
      const child =
        right < this.values.length &&
        this.values[right][0] < this.values[left][0]
          ? right
          : left;
      if (this.values[child][0] >= last[0]) break;
      this.values[index] = this.values[child];
      index = child;
    }
    this.values[index] = last;
    return first;
  }

  get size() {
    return this.values.length;
  }
}

/**
 * Запасной граф дорог из уже загруженных тайлов MapLibre. Нужен только тогда,
 * когда сервер не прислал `movement` (например, OSRM не запущен).
 */
export class RoadPath {
  private nodes: Node[] = [];
  private segments: Segment[] = [];
  private grid = new Map<string, number[]>();

  rebuild(map: MapLibreMap) {
    if (!map.isStyleLoaded() || map.getZoom() < 8) return false;
    const features = map
      .querySourceFeatures(ROAD_SOURCE, { sourceLayer: ROAD_LAYER })
      .filter(isRoutable);
    if (features.length === 0) return false;

    const nodes: Node[] = [];
    const nodeIds = new Map<string, number>();
    const segments: Segment[] = [];
    const segmentKeys = new Set<string>();
    const grid = new Map<string, number[]>();
    const getNode = (point: RoadPoint) => {
      const key = nodeKey(point);
      const known = nodeIds.get(key);
      if (known !== undefined) return known;
      const id = nodes.length;
      nodeIds.set(key, id);
      nodes.push({ point, edges: [] });
      return id;
    };

    for (const feature of features) {
      for (const line of lines(feature)) {
        for (let index = 1; index < line.length; index += 1) {
          const a = getNode(line[index - 1]);
          const b = getNode(line[index]);
          if (a === b) continue;
          const key = a < b ? `${a}:${b}` : `${b}:${a}`;
          if (segmentKeys.has(key)) continue;
          const distance = metersBetween(nodes[a].point, nodes[b].point);
          if (!Number.isFinite(distance) || distance <= 0) continue;
          segmentKeys.add(key);
          const segment = segments.length;
          segments.push({ a, b, distance });
          nodes[a].edges.push({ node: b, distance });
          nodes[b].edges.push({ node: a, distance });

          const first = nodes[a].point;
          const second = nodes[b].point;
          const minX = Math.floor(Math.min(first[0], second[0]) / GRID_SIZE);
          const maxX = Math.floor(Math.max(first[0], second[0]) / GRID_SIZE);
          const minY = Math.floor(Math.min(first[1], second[1]) / GRID_SIZE);
          const maxY = Math.floor(Math.max(first[1], second[1]) / GRID_SIZE);
          for (let x = minX; x <= maxX; x += 1) {
            for (let y = minY; y <= maxY; y += 1) {
              const cell = gridKey(x, y);
              const bucket = grid.get(cell);
              if (bucket) bucket.push(segment);
              else grid.set(cell, [segment]);
            }
          }
        }
      }
    }

    if (segments.length === 0) return false;
    if (nodes.length > 80_000) return false;
    this.nodes = nodes;
    this.segments = segments;
    this.grid = grid;
    return true;
  }

  snap(point: RoadPoint) {
    return this.closest(point)?.point;
  }

  route(from: RoadPoint, to: RoadPoint): RoadPoint[] | undefined {
    const direct = metersBetween(from, to);
    const start = this.closest(from);
    const finish = this.closest(to);
    if (!start || !finish) return undefined;
    if (direct < 8) return [start.point, finish.point];
    if (start.segment === finish.segment) {
      return [start.point, finish.point];
    }

    const startSegment = this.segments[start.segment];
    const finishSegment = this.segments[finish.segment];
    const distances = new Map<number, number>();
    const previous = new Map<number, number>();
    const heap = new MinHeap();
    const starts: [number, number][] = [
      [startSegment.a, start.fraction * startSegment.distance],
      [startSegment.b, (1 - start.fraction) * startSegment.distance],
    ];
    for (const [node, distance] of starts) {
      distances.set(node, distance);
      heap.push([distance, node]);
    }

    const goalCost = new Map<number, number>([
      [finishSegment.a, finish.fraction * finishSegment.distance],
      [finishSegment.b, (1 - finish.fraction) * finishSegment.distance],
    ]);
    let goal: number | undefined;
    let best = Infinity;
    let visited = 0;
    while (heap.size && visited < MAX_VISITED_NODES) {
      const [distance, node] = heap.pop()!;
      if (distance !== distances.get(node)) continue;
      if (distance >= best) break;
      visited += 1;
      const tail = goalCost.get(node);
      if (tail !== undefined && distance + tail < best) {
        best = distance + tail;
        goal = node;
      }
      for (const edge of this.nodes[node].edges) {
        const next = distance + edge.distance;
        if (next >= (distances.get(edge.node) ?? Infinity)) continue;
        distances.set(edge.node, next);
        previous.set(edge.node, node);
        heap.push([next, edge.node]);
      }
    }
    if (goal === undefined) return undefined;

    const path: RoadPoint[] = [];
    for (let node: number | undefined = goal; node !== undefined; ) {
      path.push(this.nodes[node].point);
      node = previous.get(node);
    }
    path.reverse();
    const route = [start.point, ...path, finish.point];
    const maxDetour =
      direct < 60
        ? direct * 2.2 + 20
        : direct < 250
          ? direct * 1.8 + 50
          : direct * 1.5 + 120;
    if (best > maxDetour) return undefined;
    for (let index = 2; index < route.length - 2; index += 1) {
      if (
        metersBetween(route[index], start.point) < 10 &&
        best > direct * 1.6
      ) {
        return undefined;
      }
    }
    return route;
  }

  private closest(point: RoadPoint): Snap | undefined {
    if (this.segments.length === 0) return undefined;
    const centerX = Math.floor(point[0] / GRID_SIZE);
    const centerY = Math.floor(point[1] / GRID_SIZE);
    const candidates = new Set<number>();
    for (let x = centerX - 1; x <= centerX + 1; x += 1) {
      for (let y = centerY - 1; y <= centerY + 1; y += 1) {
        for (const segment of this.grid.get(gridKey(x, y)) ?? []) {
          candidates.add(segment);
        }
      }
    }
    let result: Snap | undefined;
    for (const id of candidates) {
      const segment = this.segments[id];
      const projected = project(
        point,
        this.nodes[segment.a].point,
        this.nodes[segment.b].point,
      );
      if (projected.distance >= (result?.distance ?? MAX_SNAP_METERS)) continue;
      result = { ...projected, segment: id };
    }
    return result;
  }
}

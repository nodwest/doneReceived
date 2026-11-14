import type { Bus, RoadMovement, VehicleSnapshot } from '@entities/vehicle';

type Point = [number, number];
type RoadMatcher = {
  snap(point: Point): Point | undefined;
  route(from: Point, to: Point): Point[] | undefined;
};
type Segment = {
  coordinates: Point[];
  distancesM: number[];
  startAt: number;
  endAt: number;
  roadAligned: boolean;
};
type Track = {
  segments: Segment[];
  bus: Bus;
  lastPoint: Point;
  lastRawAt: number;
  lastSampleAt: number;
  lastSegmentEndAt: number;
  seenAt: number;
  playheadAt: number;
  lastFrameAt: number;
  bearing: number;
  hasRendered: boolean;
  historyBacked: boolean;
};

/** Рабочая задержка: при обновлении PIKAS раз в 8 секунд это 2–3 снапшота. */
const TARGET_LAG_MS = 20_000;
/** Без серверной истории всё равно оставляем буфер на один интервал PIKAS. */
const FALLBACK_LAG_MS = 8_000;
const HISTORY_KEEP_MS = 60_000;
const STALE_MS = 90_000;
const ANGLE_TIME_CONSTANT_MS = 220;
const MAX_TURN_RATE_DEG_PER_SEC = 140;
const RADIANS = Math.PI / 180;
const METERS_PER_DEGREE = 111_320;

function distanceMeters(a: Point, b: Point) {
  const latitude = ((a[1] + b[1]) / 2) * RADIANS;
  return Math.hypot(
    (b[0] - a[0]) * Math.cos(latitude) * METERS_PER_DEGREE,
    (b[1] - a[1]) * METERS_PER_DEGREE,
  );
}

function bearingBetween(a: Point, b: Point) {
  const latitude = ((a[1] + b[1]) / 2) * RADIANS;
  const east = (b[0] - a[0]) * Math.cos(latitude);
  const north = b[1] - a[1];
  return Math.abs(east) + Math.abs(north) > 1e-10
    ? (Math.atan2(east, north) / RADIANS + 360) % 360
    : Number.NaN;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/** Чем больше отставание, тем заметнее ускорение; в норме 1.0. */
function catchUpRate(lagMs: number) {
  if (lagMs > 4_000) return 1.25;
  if (lagMs > 1_000) return 1.12;
  if (lagMs > 200) return 1.04;
  return 1;
}

function createSegment(
  coordinates: Point[],
  startAt: number,
  endAt: number,
  roadAligned: boolean,
): Segment | undefined {
  if (
    coordinates.length < 2 ||
    !Number.isFinite(startAt) ||
    !Number.isFinite(endAt)
  )
    return undefined;
  if (endAt <= startAt) return undefined;
  const compact: Point[] = [coordinates[0]];
  const distancesM = [0];
  for (let index = 1; index < coordinates.length; index += 1) {
    const point = coordinates[index];
    if (!Number.isFinite(point[0]) || !Number.isFinite(point[1])) continue;
    const distance = distanceMeters(compact.at(-1)!, point);
    if (!Number.isFinite(distance) || distance < 0.05) continue;
    compact.push(point);
    distancesM.push(distancesM.at(-1)! + distance);
  }
  if (compact.length < 2) {
    // Очень близкие точки всё равно должны занимать время: иначе машина
    // залипает на месте между двумя обновлениями PIKAS.
    const last = coordinates.at(-1);
    if (!last || !Number.isFinite(last[0]) || !Number.isFinite(last[1]))
      return undefined;
    compact.push(last);
    distancesM.push(0);
  }
  return { coordinates: compact, distancesM, startAt, endAt, roadAligned };
}

function movementSegment(movement: RoadMovement | undefined) {
  if (!movement) return undefined;
  if (
    !Array.isArray(movement.coordinates) ||
    movement.coordinates.length < 2 ||
    !Array.isArray(movement.distancesM)
  )
    return undefined;
  return createSegment(
    movement.coordinates,
    movement.startAt,
    movement.endAt,
    movement.source === 'road',
  );
}

function rawSegment(from: Point, to: Point, startAt: number, endAt: number) {
  return createSegment([from, to], startAt, endAt, false);
}

function momentPoint(
  matcher: RoadMatcher | undefined,
  movement: RoadMovement | undefined,
  raw: Point,
): Point {
  const end = movement?.coordinates.at(-1);
  if (end) return end;
  return matcher?.snap(raw) ?? raw;
}

function segmentAt(distances: number[], distance: number) {
  let low = 0;
  let high = distances.length - 1;
  while (high - low > 1) {
    const middle = (low + high) >>> 1;
    if (distances[middle] <= distance) low = middle;
    else high = middle;
  }
  return low;
}

function pointAt(segment: Segment, distance: number): Point {
  const total = segment.distancesM.at(-1)!;
  const bounded = clamp(distance, 0, Math.max(0, total));
  const index = segmentAt(segment.distancesM, bounded);
  const start = segment.coordinates[index];
  const end = segment.coordinates[index + 1] ?? start;
  const length = segment.distancesM[index + 1] - segment.distancesM[index];
  if (length <= 0) return start;
  const fraction = (bounded - segment.distancesM[index]) / length;
  return [
    start[0] + (end[0] - start[0]) * fraction,
    start[1] + (end[1] - start[1]) * fraction,
  ];
}

function segmentPoint(segment: Segment, at: number) {
  const duration = segment.endAt - segment.startAt;
  const progress =
    duration > 0 ? clamp((at - segment.startAt) / duration, 0, 1) : 1;
  const distance = segment.distancesM.at(-1)! * progress;
  return {
    point: pointAt(segment, distance),
    distance,
    moving: segment.distancesM.at(-1)! > 0.5,
  };
}

function bearingAt(
  segment: Segment,
  distance: number,
  lookaheadM: number,
  fallback: number,
) {
  const total = segment.distancesM.at(-1)!;
  if (total <= 0.5) return fallback;
  const before = pointAt(segment, Math.max(0, distance - 2));
  const after = pointAt(segment, Math.min(total, distance + lookaheadM));
  const bearing = bearingBetween(before, after);
  return Number.isFinite(bearing) ? bearing : fallback;
}

function smoothBearing(current: number, target: number, dtMs: number) {
  if (!Number.isFinite(target)) return current;
  if (!Number.isFinite(current)) return target;
  const delta = ((((target - current + 540) % 360) + 360) % 360) - 180;
  const factor = 1 - Math.exp(-Math.max(0, dtMs) / ANGLE_TIME_CONSTANT_MS);
  const maxStep = (MAX_TURN_RATE_DEG_PER_SEC * Math.max(0, dtMs)) / 1_000;
  const step = clamp(delta * factor, -maxStep, maxStep);
  return (((current + step) % 360) + 360) % 360;
}

function findSegmentAt(segments: Segment[], at: number) {
  for (let index = segments.length - 1; index >= 0; index -= 1) {
    if (at >= segments[index].startAt) return segments[index];
  }
  return segments[0];
}

function bearingOnSegment(segment: Segment, at: number, fallback: number) {
  const { distance } = segmentPoint(segment, at);
  return bearingAt(segment, distance, 20, fallback);
}

/** Проигрывает movement с сервера с задержкой и плавным поворотом маркера. */
export class BusPlayback {
  private readonly tracks = new Map<string, Track>();
  private matcher?: RoadMatcher;
  private snapshotAt = -Infinity;
  private clockOffset = 0;

  setRoadMatcher(matcher: RoadMatcher | null) {
    this.matcher = matcher ?? undefined;
    if (!this.matcher) return;
    for (const track of this.tracks.values()) {
      if (track.segments.length > 0) continue;
      const target = this.matcher.snap([
        track.bus.longitude,
        track.bus.latitude,
      ]);
      if (!target) {
        track.lastPoint = this.matcher.snap(track.lastPoint) ?? track.lastPoint;
        continue;
      }
      const path = this.matcher.route(track.lastPoint, target);
      const segment =
        path && track.lastSampleAt > track.lastRawAt + 1
          ? createSegment(path, track.lastRawAt, track.lastSampleAt, true)
          : undefined;
      if (segment) {
        this.appendSegment(track, segment);
      } else {
        track.lastPoint = this.matcher.snap(track.lastPoint) ?? track.lastPoint;
      }
    }
  }

  /** История нужна, чтобы новым клиентам не ждать 20–30 секунд. */
  ingestHistory(
    history: VehicleSnapshot[],
    receivedAt = Date.now(),
    serverTime?: number,
  ) {
    for (const snapshot of history) {
      if (!snapshot || !Array.isArray(snapshot.vehicles)) continue;
      if (!Number.isFinite(snapshot.serverTime)) continue;
      this.ingest(snapshot.vehicles, receivedAt, snapshot.serverTime, false);
    }
    const latestServerTime = Number.isFinite(serverTime)
      ? serverTime!
      : (history.at(-1)?.serverTime ?? receivedAt);
    const target = latestServerTime - TARGET_LAG_MS;
    for (const track of this.tracks.values()) {
      if (track.hasRendered) continue;
      const first = track.segments[0];
      const latest = track.segments.at(-1);
      if (!first || !latest) continue;
      // Если истории меньше целевой задержки, не пытаемся её растянуть:
      // иначе маркер замрёт на первой точке, пока буфер не дорастёт.
      if (latest.endAt - first.startAt >= TARGET_LAG_MS - 2_000) {
        track.historyBacked = true;
        track.playheadAt = clamp(
          target,
          first.startAt,
          Math.max(first.startAt, latest.endAt),
        );
      }
      const segment = findSegmentAt(track.segments, track.playheadAt);
      const feedBearing = track.bus.bearing;
      track.bearing =
        !segment.roadAligned &&
        Number.isFinite(feedBearing) &&
        track.bus.speed > 3
          ? feedBearing
          : bearingOnSegment(segment, track.playheadAt, track.bearing);
    }
  }

  ingest(
    vehicles: Bus[],
    receivedAt: number,
    serverTime?: number,
    updateClock = true,
  ) {
    const sampleAt = Number.isFinite(serverTime)
      ? serverTime!
      : receivedAt + this.clockOffset;
    if (updateClock && Number.isFinite(serverTime)) {
      const measured = serverTime! - receivedAt;
      this.clockOffset =
        this.snapshotAt === -Infinity ||
        receivedAt - this.snapshotAt >= STALE_MS
          ? measured
          : this.clockOffset * 0.9 + measured * 0.1;
    }
    this.snapshotAt = receivedAt;

    for (const bus of vehicles) {
      if (
        !bus ||
        !Number.isFinite(bus.longitude) ||
        !Number.isFinite(bus.latitude)
      )
        continue;
      const rawPoint: Point = [bus.longitude, bus.latitude];
      const key = this.key(bus);
      const movement = movementSegment(bus.movement);
      let track = this.tracks.get(key);
      if (!track) {
        track = {
          segments: [],
          bus,
          lastPoint: momentPoint(this.matcher, movement, rawPoint),
          lastRawAt: sampleAt,
          lastSampleAt: sampleAt,
          lastSegmentEndAt: -Infinity,
          seenAt: receivedAt,
          playheadAt: sampleAt,
          lastFrameAt: receivedAt,
          bearing: Number.isFinite(bus.bearing) ? bus.bearing : 0,
          hasRendered: false,
          historyBacked: false,
        };
        this.tracks.set(key, track);
        if (movement) {
          this.appendSegment(track, movement);
          track.bearing =
            !movement.roadAligned &&
            Number.isFinite(bus.bearing) &&
            bus.speed > 3
              ? bus.bearing
              : bearingOnSegment(movement, movement.endAt, track.bearing);
        }
        continue;
      }

      track.bus = bus;
      track.seenAt = receivedAt;
      track.lastSampleAt = sampleAt;
      if (movement && movement.endAt > track.lastSegmentEndAt + 1) {
        this.appendSegment(track, movement);
      } else if (!movement && sampleAt > track.lastRawAt + 1) {
        // Сервер не прислал дорожный участок (OSRM выключен или не успел).
        // Строим запасной путь по дорогам карты, а не режем напрямую через
        // дома. Если граф ещё не готов, ждём его, а не рисуем прямую.
        const target = this.matcher?.snap(rawPoint) ?? rawPoint;
        const path = this.matcher?.route(track.lastPoint, target);
        const fallback =
          path && path.length >= 2
            ? createSegment(path, track.lastRawAt, sampleAt, true)
            : distanceMeters(track.lastPoint, target) <= 8
              ? rawSegment(track.lastPoint, target, track.lastRawAt, sampleAt)
              : undefined;
        if (fallback) this.appendSegment(track, fallback);
      }
      if (!track.segments.length && Number.isFinite(bus.bearing))
        track.bearing = bus.bearing;
    }
  }

  frame(
    now: number,
    visible: (lng: number, lat: number) => boolean = () => true,
  ) {
    const serverNow = now + this.clockOffset;
    const targetTime = serverNow - TARGET_LAG_MS;
    const vehicles: Bus[] = [];
    let active = false;
    for (const [key, track] of this.tracks) {
      if (now - track.seenAt >= STALE_MS) {
        this.tracks.delete(key);
        continue;
      }
      track.hasRendered = true;
      while (
        track.segments.length > 2 &&
        track.segments[0].endAt < serverNow - HISTORY_KEEP_MS
      ) {
        track.segments.shift();
      }
      const latest = track.segments.at(-1);
      if (!latest) {
        if (visible(...track.lastPoint)) {
          vehicles.push({
            ...track.bus,
            longitude: track.lastPoint[0],
            latitude: track.lastPoint[1],
            bearing: track.bearing,
          });
        }
        continue;
      }

      const frameDelta = clamp(now - track.lastFrameAt, 16, 1_000);
      track.lastFrameAt = now;
      const earliest = track.segments[0];
      let desired = latest.endAt;
      let playhead = clamp(track.playheadAt, earliest.startAt, latest.endAt);
      if (track.historyBacked) {
        desired = clamp(targetTime, earliest.startAt, latest.endAt);
      } else {
        // Без истории держим буфер на один интервал PIKAS. Так машина
        // продолжает ехать, пока не пришла следующая пара координат,
        // вместо остановки на конце последнего отрезка.
        desired = clamp(
          serverNow - FALLBACK_LAG_MS,
          earliest.startAt,
          latest.endAt,
        );
      }
      if (desired > playhead) {
        const lag = desired - playhead;
        playhead = Math.min(desired, playhead + frameDelta * catchUpRate(lag));
      }
      track.playheadAt = playhead;

      const segment = findSegmentAt(track.segments, playhead);
      const { point, distance, moving } = segmentPoint(segment, playhead);
      const speedMps = Math.max(0, track.bus.speed / 3.6);
      const lookahead = clamp(speedMps * 1.2, 8, 30);
      const feedBearing = track.bus.bearing;
      const useFeedBearing =
        !segment.roadAligned &&
        Number.isFinite(feedBearing) &&
        track.bus.speed > 3;
      const targetBearing = useFeedBearing
        ? feedBearing
        : moving
          ? bearingAt(segment, distance, lookahead, track.bearing)
          : track.bearing;
      track.bearing = smoothBearing(track.bearing, targetBearing, frameDelta);

      if (visible(...point)) {
        vehicles.push({
          ...track.bus,
          longitude: point[0],
          latitude: point[1],
          bearing: track.bearing,
        });
      }
      active ||=
        playhead < latest.endAt - 5 ||
        (track.historyBacked && desired > playhead + 5);
    }
    return { vehicles, active };
  }

  private appendSegment(track: Track, segment: Segment) {
    if (segment.endAt <= track.lastSegmentEndAt + 1) return;
    track.segments.push(segment);
    while (
      track.segments.length > 2 &&
      track.segments[0].endAt < segment.endAt - HISTORY_KEEP_MS
    ) {
      track.segments.shift();
    }
    track.lastSegmentEndAt = segment.endAt;
    track.lastPoint = segment.coordinates.at(-1)!;
    track.lastRawAt = Math.max(track.lastRawAt, segment.endAt);
  }

  private key(bus: Bus) {
    return JSON.stringify([bus.type, bus.route, bus.vehicle]);
  }
}

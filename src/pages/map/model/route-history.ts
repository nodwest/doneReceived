import type { HistoryPoint } from '@widgets/map';

/** Задание, у которого известно время сдачи: по нему ищем точку маршрута. */
export type RouteTask = {
  id: string;
  /** Момент сдачи задания (ISO). */
  at: string;
  title: string | null;
};

/** Точки маршрута, подготовленные один раз на набор данных. */
export type RouteIndex = {
  /** Точки в хронологическом порядке. */
  points: HistoryPoint[];
  /** Время точки в миллисекундах: `Date.parse` не повторяется на каждую задачу. */
  times: number[];
};

/** Задания, попавшие в один маркер: одно место в радиусе 30 м. */
export type TaskMarkerGroup = {
  /** id самого нового задания группы — он же id маркера. */
  id: string;
  lat: number;
  lng: number;
  label: string;
  /** От новых к старым, как их обходят при сборке. */
  tasks: RouteTask[];
};

/** Точка маршрута считается: не старше 90 с до сдачи и с точностью до 50 м. */
const MATCH_WINDOW_MS = 90_000;
const MAX_ACCURACY_M = 50;
/** Два задания ближе 30 м — один маркер. */
const GROUP_RADIUS_M = 30;
const METERS_PER_DEGREE = 111_000;

/**
 * Готовит точки один раз: сортирует хронологию и кэширует время каждой точки.
 * Раньше `Date.parse` и перебор всех точек выполнялись для каждого задания, а
 * точек на день может быть до 4 000.
 */
export function prepareRoutePoints(points: HistoryPoint[]): RouteIndex {
  const withTime = points
    .map((point) => ({ point, time: Date.parse(point.recordedAt) }))
    .filter(({ time }) => Number.isFinite(time));
  // Сервер отдаёт точки по порядку, но хронология — часть правила окна 90 с,
  // поэтому сортируем до индексации. Порядок равных моментов сохраняется.
  withTime.sort((a, b) => a.time - b.time);
  return {
    points: withTime.map((item) => item.point),
    times: withTime.map((item) => item.time),
  };
}

/**
 * Последняя по хронологии точка перед сдачей задания: не раньше 90 с до неё и
 * с точностью не хуже 50 м. Нет подходящей — null.
 */
export function matchTaskPoint(
  index: RouteIndex,
  at: number,
): HistoryPoint | null {
  if (!Number.isFinite(at)) return null;
  // Первая точка, которая позже сдачи: смотрим назад, пока не вышли из окна.
  let low = 0;
  let high = index.times.length;
  while (low < high) {
    const middle = (low + high) >> 1;
    if (index.times[middle] <= at) low = middle + 1;
    else high = middle;
  }
  for (let i = low - 1; i >= 0; i--) {
    if (at - index.times[i] > MATCH_WINDOW_MS) return null;
    const point = index.points[i];
    if (point.accuracy !== null && point.accuracy <= MAX_ACCURACY_M) {
      return point;
    }
  }
  return null;
}

function samePlace(group: { lat: number; lng: number }, point: HistoryPoint) {
  const lat = point.lat;
  return (
    Math.hypot(
      (group.lat - point.lat) * METERS_PER_DEGREE,
      (group.lng - point.lng) *
        METERS_PER_DEGREE *
        Math.cos((lat * Math.PI) / 180),
    ) <= GROUP_RADIUS_M
  );
}

/**
 * Разносит задания по маркерам: каждому — ближайшая подходящая точка маршрута,
 * задания в одном месте — в один маркер. Возвращает группы и связь задания с
 * маркером, чтобы список событий не искал её перебором на каждой строке.
 */
export function groupTaskMarkers(
  tasks: RouteTask[],
  index: RouteIndex,
): { groups: TaskMarkerGroup[]; markerOf: Map<string, string> } {
  const groups: TaskMarkerGroup[] = [];
  const markerOf = new Map<string, string>();
  // От новых к старым: подпись группы и её id — по первому попавшему заданию.
  for (let i = tasks.length - 1; i >= 0; i--) {
    const task = tasks[i];
    if (!task.title) continue;
    const point = matchTaskPoint(index, Date.parse(task.at));
    if (!point) continue;
    const existing = groups.find((group) => samePlace(group, point));
    if (existing) {
      existing.tasks.push(task);
      existing.label = String(existing.tasks.length);
      markerOf.set(task.id, existing.id);
    } else {
      groups.push({
        id: task.id,
        lat: point.lat,
        lng: point.lng,
        label: '✓',
        tasks: [task],
      });
      markerOf.set(task.id, task.id);
    }
  }
  return { groups, markerOf };
}

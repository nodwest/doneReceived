import { describe, expect, it } from 'vitest';
import type { HistoryPoint } from '@widgets/map';
import {
  groupTaskMarkers,
  matchTaskPoint,
  prepareRoutePoints,
  type RouteTask,
} from './route-history';

const day = (hh: number, mm: number, ss = 0) =>
  new Date(Date.UTC(2026, 10, 26, hh, mm, ss)).toISOString();

const point = (
  at: string,
  lat = 55.75,
  lng = 37.61,
  accuracy: number | null = 10,
): HistoryPoint => ({
  lat,
  lng,
  accuracy,
  recordedAt: at,
  transitions: [],
});

const task = (id: string, at: string, title: string | null = 'Задача') =>
  ({ id, at, title }) as RouteTask;

/**
 * Прежний алгоритм экрана: на каждое задание — перебор всех точек и повторный
 * `Date.parse`, группы ищутся перебором. Оставлен в тесте как эталон поведения.
 */
function legacyGroups(tasks: RouteTask[], points: HistoryPoint[]) {
  const groups: {
    id: string;
    lat: number;
    lng: number;
    label: string;
    tasks: string[];
  }[] = [];
  for (const item of [...tasks].reverse()) {
    if (!item.title) continue;
    let match: HistoryPoint | undefined;
    const at = Date.parse(item.at);
    for (const candidate of points) {
      const elapsed = at - Date.parse(candidate.recordedAt);
      if (
        elapsed >= 0 &&
        elapsed <= 90_000 &&
        candidate.accuracy !== null &&
        candidate.accuracy <= 50
      ) {
        match = candidate;
      }
    }
    if (!match) continue;
    const { lat, lng } = match;
    const existing = groups.find(
      (group) =>
        Math.hypot(
          (group.lat - lat) * 111_000,
          (group.lng - lng) * 111_000 * Math.cos((lat * Math.PI) / 180),
        ) <= 30,
    );
    if (existing) {
      existing.tasks.push(item.id);
      existing.label = String(existing.tasks.length);
    } else {
      groups.push({ id: item.id, lat, lng, label: '✓', tasks: [item.id] });
    }
  }
  return groups;
}

describe('prepareRoutePoints', () => {
  it('сортирует хронологию и кэширует время точек', () => {
    const index = prepareRoutePoints([
      point(day(10, 0, 30)),
      point(day(10, 0, 0)),
      point(day(10, 1)),
    ]);
    expect(index.points.map((item) => item.recordedAt)).toEqual([
      day(10, 0, 0),
      day(10, 0, 30),
      day(10, 1),
    ]);
    expect(index.times).toEqual(
      index.points.map((item) => Date.parse(item.recordedAt)),
    );
  });
});

describe('matchTaskPoint', () => {
  it('ignores malformed timestamps without blocking valid points', () => {
    const valid = point(day(10, 0));
    const index = prepareRoutePoints([valid, point('invalid')]);
    expect(matchTaskPoint(index, Date.parse(day(10, 0, 30)))).toBe(valid);
    expect(matchTaskPoint(index, Number.NaN)).toBeNull();
  });

  const index = prepareRoutePoints([
    point(day(10, 0)),
    point(day(10, 0, 30)),
    point(day(10, 2)),
  ]);

  it('берёт последнюю точку в окне 90 секунд', () => {
    expect(matchTaskPoint(index, Date.parse(day(10, 0, 45)))?.recordedAt).toBe(
      day(10, 0, 30),
    );
  });

  it('границы окна: ровно 90 секунд — попадание, 90 секунд и 1 мс — нет', () => {
    const single = prepareRoutePoints([point(day(10, 0))]);
    const at = Date.parse(day(10, 0)) + 90_000;
    expect(matchTaskPoint(single, at)?.recordedAt).toBe(day(10, 0));
    expect(matchTaskPoint(single, at + 1)).toBeNull();
  });

  it('точка позже сдачи задания не подходит', () => {
    expect(matchTaskPoint(index, Date.parse(day(10, 0)) - 1)).toBeNull();
  });

  it('точность: 50 м подходит, 51 и пустая — нет', () => {
    const exact = prepareRoutePoints([point(day(11, 0), 55.75, 37.61, 50)]);
    expect(matchTaskPoint(exact, Date.parse(day(11, 0, 30)))).not.toBeNull();
    const far = prepareRoutePoints([point(day(11, 0), 55.75, 37.61, 51)]);
    expect(matchTaskPoint(far, Date.parse(day(11, 0, 30)))).toBeNull();
    const unknown = prepareRoutePoints([point(day(11, 0), 55.75, 37.61, null)]);
    expect(matchTaskPoint(unknown, Date.parse(day(11, 0, 30)))).toBeNull();
  });

  it('неточная точка в окне не мешает найти точную раньше', () => {
    const mixed = prepareRoutePoints([
      point(day(11, 0), 55.75, 37.61, 10),
      point(day(11, 0, 20), 55.75, 37.61, 200),
    ]);
    expect(matchTaskPoint(mixed, Date.parse(day(11, 0, 40)))?.recordedAt).toBe(
      day(11, 0),
    );
  });
});

describe('groupTaskMarkers', () => {
  it('задания в радиусе 30 м — один маркер со счётчиком', () => {
    const index = prepareRoutePoints([
      point(day(10, 0), 55.75, 37.61),
      point(day(10, 1), 55.75, 37.61),
    ]);
    const { groups, markerOf } = groupTaskMarkers(
      [task('a', day(10, 0, 10)), task('b', day(10, 1, 10))],
      index,
    );
    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe('2');
    expect(groups[0].id).toBe('b');
    expect(markerOf.get('a')).toBe('b');
    expect(markerOf.get('b')).toBe('b');
  });

  it('дальше 30 м — отдельные маркеры', () => {
    const index = prepareRoutePoints([
      point(day(10, 0), 55.75, 37.61),
      point(day(10, 1), 55.7505, 37.61),
    ]);
    const { groups } = groupTaskMarkers(
      [task('a', day(10, 0, 10)), task('b', day(10, 1, 10))],
      index,
    );
    expect(groups).toHaveLength(2);
  });

  it('задание без заголовка и без точки маршрута пропускается', () => {
    const index = prepareRoutePoints([point(day(10, 0))]);
    const { groups, markerOf } = groupTaskMarkers(
      [
        task('нет-заголовка', day(10, 0, 10), null),
        task('без-точки', day(12, 0)),
      ],
      index,
    );
    expect(groups).toHaveLength(0);
    expect(markerOf.size).toBe(0);
  });

  it('пустой маршрут — маркеров нет', () => {
    const { groups } = groupTaskMarkers(
      [task('a', day(10, 0, 10))],
      prepareRoutePoints([]),
    );
    expect(groups).toHaveLength(0);
  });

  it('на 4 000 точек и длинном списке заданий результат совпадает с прежним алгоритмом', () => {
    const points: HistoryPoint[] = [];
    let at = Date.parse(day(0, 0));
    for (let i = 0; i < 4_000; i++) {
      at += 15_000;
      points.push(
        point(
          new Date(at).toISOString(),
          55.75 + Math.sin(i / 40) * 0.01,
          37.61 + Math.cos(i / 40) * 0.01,
          i % 17 === 0 ? 120 : 8,
        ),
      );
    }
    const tasks = Array.from({ length: 40 }, (_, i) =>
      task(
        `t${i}`,
        new Date(at - 3_600_000 + i * 60_000).toISOString(),
        `Задача ${i}`,
      ),
    );
    const index = prepareRoutePoints(points);
    const { groups, markerOf } = groupTaskMarkers(tasks, index);
    const legacy = legacyGroups(tasks, points);
    expect(groups).toHaveLength(legacy.length);
    expect(
      groups.map((group) => [
        group.id,
        group.label,
        group.tasks.map((item) => item.id),
      ]),
    ).toEqual(legacy.map((group) => [group.id, group.label, group.tasks]));
    for (const group of legacy) {
      for (const id of group.tasks) expect(markerOf.get(id)).toBe(group.id);
    }
  });
});

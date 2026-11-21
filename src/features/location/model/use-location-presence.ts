import { skipToken, useQuery } from '@tanstack/react-query';
import { apiRequest, queryRoots } from '@shared/api';
import type { Location, Presence, ZonePresence } from '@entities/user';
import { useLocationZones } from '@entities/zone';

export type ChildPresence = {
  childId: string;
  /** Время последнего события геолокации; null — координат ещё не было. */
  updatedAt: string | null;
  /** Время измерения на устройстве; старые ответы его не содержат. */
  recordedAt?: string | null;
  accuracy: number | null;
  zones: ZonePresence[];
  /** Подтверждённо дома; в ответах старого сервера поля нет. */
  atHome?: boolean;
  /** Когда пришёл домой или ушёл; null — момент неизвестен. */
  atHomeSince?: string | null;
};

/** Час без координат — уже «нет данных», а не «дома вчера». */
export const LOCATION_STALE_MS = 60 * 60_000;

/** Данные ребёнка свежие: можно показывать его статус, а не «нет данных». */
export function isLocationPresenceFresh(
  child: ChildPresence | undefined,
  now: Date,
) {
  if (!child?.updatedAt) return false;
  return now.getTime() - Date.parse(child.updatedAt) <= LOCATION_STALE_MS;
}

/**
 * Плашка «Дома / Не дома» по подтверждённому `atHome` с сервера.
 * `undefined` — статус неизвестен: данных нет, они устарели или сервер
 * старый и новых полей не присылает.
 */
export function homePresenceFrom(
  child: ChildPresence | undefined,
  now: Date,
  homeZoneId: string | null | undefined,
): Presence | undefined {
  if (!child || child.atHome === undefined) return undefined;
  if (!isLocationPresenceFresh(child, now)) return undefined;
  if (
    !child.atHome &&
    (homeZoneId === undefined ||
      (homeZoneId !== null &&
        !child.zones.some(
          (zone) => zone.zoneId === homeZoneId && zone.state === 'outside',
        )))
  )
    return undefined;
  return {
    atHome: child.atHome,
    since: child.atHomeSince ?? null,
  };
}

export function useHomeZoneId(familyId: string | null) {
  const { data: zones } = useLocationZones(familyId);
  return zones ? (zones.find((zone) => zone.isHome)?.id ?? null) : undefined;
}

export type LocationPresence = {
  children: ChildPresence[];
};

export const presenceKeys = {
  all: queryRoots.families,
  list: (familyId: string | null) =>
    [...presenceKeys.all, familyId, 'location-presence'] as const,
};

/** GET /families/:id/location-presence — последние состояния детей по зонам. */
export function fetchLocationPresence(familyId: string) {
  return apiRequest<LocationPresence>(
    `/families/${familyId}/location-presence`,
  );
}

/**
 * Последние подтверждённые состояния детей. Нужны, чтобы показать «Нет
 * данных» и возраст события после перезапуска, не дожидаясь нового сокета.
 */
export function useLocationPresence(familyId: string | null) {
  return useQuery({
    queryKey: presenceKeys.list(familyId),
    queryFn: familyId ? () => fetchLocationPresence(familyId) : skipToken,
    retry: 1,
    staleTime: 15_000,
    // Родителю состояния приходят по WS, ребёнку — только своим запросом:
    // редкий опрос закрывает и этот случай, и пропущенные события.
    refetchInterval: 30_000,
  });
}

/** Обновить кэш после live-события `location`; отсутствующие поля сохраняем. */
export function applyLocationPresence(
  current: LocationPresence | undefined,
  location: Location,
) {
  const childId = location.childId;
  if (!childId) return current ?? { children: [] };
  const children = current?.children ?? [];
  const previous = children.find((child) => child.childId === childId);
  const measuredAt = location.recordedAt ?? location.updatedAt;
  const previousMeasuredAt = previous?.recordedAt ?? previous?.updatedAt;
  const measuredTime = measuredAt ? Date.parse(measuredAt) : null;
  const previousTime = previousMeasuredAt
    ? Date.parse(previousMeasuredAt)
    : null;
  // REST мог уже загрузить новое назначение дома для той же GPS-точки.
  if (
    previousTime !== null &&
    measuredTime !== null &&
    measuredTime <= previousTime
  ) {
    return current;
  }
  const atHome =
    location.atHome === undefined ? previous?.atHome : location.atHome;
  const atHomeSince =
    location.atHome === undefined
      ? (previous?.atHomeSince ?? null)
      : (location.atHomeSince ?? null);
  const previousZones = previous?.zones ?? [];
  const nextZones = location.zones ?? previousZones;
  // Координаты приходят каждые пару секунд, а состояние зоны и «дома» меняется
  // редко. Не перерисовываем экран на каждую точку: возраст обновит опрос.
  if (
    previous?.updatedAt &&
    JSON.stringify(previousZones) === JSON.stringify(nextZones) &&
    previous.atHome === atHome &&
    (previous.atHomeSince ?? null) === atHomeSince
  ) {
    return current ?? { children: [] };
  }
  const next: ChildPresence = {
    childId,
    updatedAt: location.updatedAt ?? new Date().toISOString(),
    recordedAt: location.recordedAt ?? previous?.recordedAt ?? null,
    accuracy: location.accuracy ?? previous?.accuracy ?? null,
    zones: nextZones,
    atHome,
    atHomeSince,
  };
  return {
    children: [...children.filter((child) => child.childId !== childId), next],
  };
}

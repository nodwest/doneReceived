import { skipToken, useQuery } from '@tanstack/react-query';
import { apiRequest, queryRoots } from '@shared/api';
import type { Location, ZonePresence } from '@entities/user';

export type ChildPresence = {
  childId: string;
  /** Время последнего события геолокации; null — координат ещё не было. */
  updatedAt: string | null;
  accuracy: number | null;
  zones: ZonePresence[];
};

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
  const previousZones = previous?.zones ?? [];
  const nextZones = location.zones ?? previousZones;
  // Координаты приходят каждые пару секунд, а состояние зоны меняется редко.
  // Не перерисовываем экран на каждую точку: возраст обновит опрос раз в 30 с.
  if (
    previous?.updatedAt &&
    JSON.stringify(previousZones) === JSON.stringify(nextZones)
  ) {
    return current ?? { children: [] };
  }
  const next: ChildPresence = {
    childId,
    updatedAt: location.updatedAt ?? new Date().toISOString(),
    accuracy: location.accuracy ?? previous?.accuracy ?? null,
    zones: nextZones,
  };
  return {
    children: [...children.filter((child) => child.childId !== childId), next],
  };
}

import { skipToken, useQuery } from '@tanstack/react-query';
import { queryRoots } from '@shared/api';
import { fetchLocationZones } from './zones-api';

/** Ключи геозон рядом с ключами семьи: сброс семьи сбрасывает и зоны. */
export const zonesKeys = {
  all: queryRoots.families,
  list: (familyId: string | null) =>
    [...zonesKeys.all, familyId, 'location-zones'] as const,
};

/** Геозоны семьи; без семьи (null) запроса нет. */
export function useLocationZones(familyId: string | null) {
  return useQuery({
    queryKey: zonesKeys.list(familyId),
    queryFn: familyId ? () => fetchLocationZones(familyId) : skipToken,
    // Ручки может не быть на старом стенде: одна повторная попытка, дальше
    // экран показывает «областей нет», а не бесконечную загрузку.
    retry: 1,
    staleTime: 60_000,
  });
}

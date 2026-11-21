import { skipToken, useQuery } from '@tanstack/react-query';
import { apiRequest, queryRoots } from '@shared/api';

export type FamilyLocation = {
  userId: string;
  childId: string | null;
  lat: number;
  lng: number;
  accuracy: number | null;
  updatedAt: string;
  /** Время измерения на устройстве; старые ответы его не содержат. */
  recordedAt?: string | null;
  zoneId: string | null;
  /** Подтверждённо дома; в ответах старого сервера поля нет. */
  atHome?: boolean;
  /** Когда пришёл домой или ушёл; null — момент неизвестен. */
  atHomeSince?: string | null;
  deviceId: string | null;
  deviceLabel: string;
  displayName: string;
  avatarUrl: string | null;
  kind: 'parent' | 'child';
  color: string;
};

export const familyLocationsKeys = {
  all: queryRoots.families,
  list: (familyId: string | null) =>
    [...familyLocationsKeys.all, familyId, 'locations'] as const,
};

/** GET /families/:id/locations — последние точки, которые видит вошедший. */
export function fetchFamilyLocations(familyId: string) {
  return apiRequest<FamilyLocation[]>(`/families/${familyId}/locations`);
}

export function useFamilyLocations(familyId: string | null) {
  return useQuery({
    queryKey: familyLocationsKeys.list(familyId),
    queryFn: familyId ? () => fetchFamilyLocations(familyId) : skipToken,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

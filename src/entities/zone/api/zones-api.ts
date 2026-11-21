import { apiRequest } from '@shared/api';
import type { MapZone, ZonePoint } from '../model/zone';

/**
 * GET /families/:id/location-zones — геозоны семьи. Доступно активным
 * участникам семьи, поэтому ручка открыта и ребёнку. 403 — не участник.
 */
export function fetchLocationZones(familyId: string) {
  return apiRequest<MapZone[]>(`/families/${familyId}/location-zones`);
}

export type LocationZoneInput = {
  name: string;
  /** Вершины контура по порядку обхода, минимум три. */
  points: ZonePoint[];
  /** Домашняя область; в семье может быть только одна (иначе 409). */
  isHome?: boolean;
};

/**
 * POST /families/:id/location-zones — создать геозону. Нужна роль owner или
 * admin, в семье не больше 20 зон; контур проверяет сервер (не самопересечение,
 * площадь и т. п.).
 */
export function createLocationZone(familyId: string, input: LocationZoneInput) {
  return apiRequest<MapZone>(`/families/${familyId}/location-zones`, {
    method: 'POST',
    body: input,
  });
}

/**
 * PATCH /families/:id/location-zones/:zoneId — изменить название и/или
 * контур. Нужна роль owner или admin; пустое тело сервер отклоняет.
 */
export function updateLocationZone(
  familyId: string,
  zoneId: string,
  changes: Partial<LocationZoneInput>,
) {
  return apiRequest<MapZone>(`/families/${familyId}/location-zones/${zoneId}`, {
    method: 'PATCH',
    body: changes,
  });
}

/**
 * DELETE /families/:id/location-zones/:zoneId — удалить геозону. Нужна роль
 * owner или admin; повторное удаление вернёт 404.
 */
export function deleteLocationZone(familyId: string, zoneId: string) {
  return apiRequest<null>(`/families/${familyId}/location-zones/${zoneId}`, {
    method: 'DELETE',
  });
}

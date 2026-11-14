import type { GeoJSONSource } from 'maplibre-gl';

export type UserLocation = {
  /** id профиля ребёнка (или аккаунта, если профиля нет). */
  id: string;
  lat: number;
  lng: number;
};

/**
 * Заменить точки детей одним набором: карта показывает всех, кто сейчас
 * виден, а не только последнего приславшего координаты.
 */
export function setUserLocations(
  source: GeoJSONSource,
  locations: readonly UserLocation[],
) {
  source.setData({
    type: 'FeatureCollection',
    features: locations.map(({ id, lat, lng }) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [lng, lat] },
      properties: { id },
    })),
  });
}

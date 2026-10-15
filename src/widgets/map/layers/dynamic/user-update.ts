import type { GeoJSONSource } from 'maplibre-gl';

export function updateUserLocation(
  source: GeoJSONSource,
  userId: string,
  lat: number,
  lng: number,
) {
  source.setData({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          id: userId,
        },
      },
    ],
  });
}

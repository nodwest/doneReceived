import type { GeoJSONSourceSpecification } from 'maplibre-gl';

export const userSource: GeoJSONSourceSpecification = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [39.720753, 47.25136],
        },
        properties: {
          id: 'user-1',
          name: 'Пользователь 1',
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [39.690794, 47.251195],
        },
        properties: {
          id: 'user-2',
          name: 'Пользователь 2',
        },
      },
    ],
  },
};

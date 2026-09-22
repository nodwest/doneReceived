export const usersSource = {
  type: 'geojson' as const,
  data: {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [39.720753, 47.25136],
        },
        properties: {
          id: 'user-1',
          name: 'Пользователь 1',
        },
      },
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
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

export const usersLayer = {
  id: 'users',
  type: 'circle' as const,
  source: 'users',

  paint: {
    'circle-radius': 7,
    'circle-color': '#1976d2',
    'circle-stroke-color': '#ffffff',
    'circle-stroke-width': 2,
  },
};

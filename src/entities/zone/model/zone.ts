/** Вершина контура геозоны. */
export type ZonePoint = {
  lat: number;
  lng: number;
};

/**
 * Геозона семьи: GET /families/:familyId/location-zones. Контур не замкнут —
 * сервер замыкает его сам, на карте замыкаем тоже.
 */
export type MapZone = {
  id: string;
  familyId: string;
  name: string;
  points: ZonePoint[];
  /** Домашняя область семьи: по ней сервер считает atHome у детей. */
  isHome: boolean;
  /** UUID родителя, создавшего зону. */
  createdBy: string;
  createdAt: string;
};

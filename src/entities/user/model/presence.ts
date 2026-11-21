/** Где член семьи сейчас: дома или нет, и с какого момента. */
export interface Presence {
  atHome: boolean;
  /** ISO-время начала подтверждённого статуса, если оно известно. */
  since: string | null;
}

/** Точка на карте. */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Где член семьи сейчас: дома или нет, и с какого момента. */
export interface Presence {
  atHome: boolean;
  /** ISO-время, когда пришёл домой или ушёл. */
  since: string;
}

/** Точка на карте. */
export interface GeoPoint {
  lat: number;
  lng: number;
}

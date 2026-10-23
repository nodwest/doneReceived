import type { Child } from './child';
import type { GeoPoint, Presence } from './presence';

/** Ребёнок с данными для профиля: баланс, статус «дома» и место на карте. */
export interface ChildProfile extends Child {
  balance: number;
  presence: Presence;
  position: GeoPoint;
}

import type { ImageSourcePropType } from 'react-native';
import type { GeoPoint, Presence } from './presence';

/** Родитель с данными для профиля: выплаченные награды, статус и место на карте. */
export interface ParentProfile {
  id: number;
  name: string;
  avatar: ImageSourcePropType;
  rewardsPaid: number;
  presence: Presence;
  position: GeoPoint;
}

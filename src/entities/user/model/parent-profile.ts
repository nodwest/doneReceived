import type { ImageSourcePropType } from 'react-native';
import type { GeoPoint, Presence } from './presence';
import type { FamilyRole } from './role';

/** Родитель с данными для профиля: статус и место на карте (выплаченное — по истории). */
export interface ParentProfile {
  id: number;
  name: string;
  /** Роль в семье: у родителя всегда `parent`. */
  role: Extract<FamilyRole, 'parent'>;
  avatar: ImageSourcePropType;
  presence: Presence;
  position: GeoPoint;
}

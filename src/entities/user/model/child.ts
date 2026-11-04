import type { ImageSourcePropType } from 'react-native';
import type { FamilyRole } from './role';

export interface Child {
  id: number;
  name: string;
  /** Роль в семье: у ребёнка всегда `child`. */
  role: Extract<FamilyRole, 'child'>;
  avatar: ImageSourcePropType;
}

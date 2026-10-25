import type { ImageSourcePropType } from 'react-native';

export type ActivityStatus = 'pending' | 'approved';

export interface Activity {
  id: number;
  childName: string;
  avatar: ImageSourcePropType;
  action: string;
  /** ISO-время события. */
  at: string;
  status: ActivityStatus;
  reward: number;
}

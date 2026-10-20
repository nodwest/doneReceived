import type { ImageSourcePropType } from 'react-native';

export type ActivityStatus = 'pending' | 'approved';

export interface Activity {
  id: number;
  childName: string;
  avatar: ImageSourcePropType;
  action: string;
  timeAgo: string;
  status: ActivityStatus;
  reward: number;
}

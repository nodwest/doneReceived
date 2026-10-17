export type ActivityStatus = 'pending' | 'approved';

export interface Activity {
  id: number;
  childName: string;
  avatarColor: string;
  action: string;
  timeAgo: string;
  status: ActivityStatus;
  reward: number;
}

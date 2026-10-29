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

/** review — отправлено на проверку, approved — подтверждено, new — новое задание. */
export type ChildActivityKind = 'review' | 'approved' | 'new';

/** Событие в ленте ребёнка: с его заданием и родителем, который его проверяет или дал. */
export interface ChildActivity {
  id: number;
  kind: ChildActivityKind;
  /** Название задания. */
  task: string;
  parentName: string;
  avatar: ImageSourcePropType;
  /** ISO-время события. */
  at: string;
  reward: number;
}

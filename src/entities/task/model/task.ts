import type { ImageSourcePropType } from 'react-native';

/** active — ребёнок выполняет; review — отмечено выполненным, ждёт проверки родителя. */
export type TaskState = 'active' | 'review';

export interface TaskAssignee {
  id: number;
  name: string;
  avatar: ImageSourcePropType;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  status: TaskState;
  assignee: TaskAssignee;
  /** ISO-время создания. */
  createdAt: string;
  /** ISO-время, когда задача перестаёт быть активной; null — без срока. */
  expiresAt: string | null;
  /** ISO-время, когда ребёнок отметил задачу выполненной. */
  doneAt: string | null;
  /** Фото-отчёт ребёнка; null — снимка нет. */
  photo: ImageSourcePropType | null;
}

/** Награда в формате карточек: «$5.00». */
export const formatReward = (reward: number) => `$${reward.toFixed(2)}`;

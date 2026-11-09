import type { ImageSourcePropType } from 'react-native';

/**
 * active — ребёнок выполняет; review — отмечено выполненным, ждёт проверки
 * родителя; done — родитель подтвердил, награда выплачена, задание ушло в
 * историю (в списке заданий его больше нет).
 */
export type TaskState = 'active' | 'review' | 'done';

/** Почему родитель вернул задание; подписи — reviewTask.reasons.*. */
export type RejectReasonKey = 'not-done-properly' | 'not-finished' | 'other';

/** Отказ родителя: задание снова активно, ребёнок видит, что переделать. */
export interface TaskRejection {
  reason: RejectReasonKey;
  /** Комментарий родителя; пустая строка — без комментария. */
  comment: string;
  /** id родителя, который вернул задание. */
  by: number;
}

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
  /** id родителя, создавшего задачу. */
  createdBy: number;
  /** ISO-время создания. */
  createdAt: string;
  /** ISO-время, когда задача перестаёт быть активной; null — без срока. */
  expiresAt: string | null;
  /** ISO-время, когда ребёнок отметил задачу выполненной. */
  doneAt: string | null;
  /** Фото-отчёт ребёнка; null — снимка нет. */
  photo: ImageSourcePropType | null;
  /** Последний отказ родителя; null — задание не возвращали. */
  rejection: TaskRejection | null;
}

/** Награда в формате карточек: «$5.00». */
export const formatReward = (reward: number) => `$${reward.toFixed(2)}`;

/** Награда коротко, без копеек: «$5». */
export const formatRewardShort = (reward: number) =>
  Number.isInteger(reward) ? `$${reward}` : `$${reward.toFixed(2)}`;

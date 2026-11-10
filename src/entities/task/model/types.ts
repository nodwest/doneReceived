import type { RejectReasonKey, TaskState } from './task';

export enum TaskStatus {
  Pending = 'pending',
  Done = 'done',
  Cancelled = 'cancelled',
}

export interface TaskShortViewProps {
  id: number;
  title: string;
  description: string;
  penalty: number;
  award: number;
  status?: TaskStatus;
  authorId?: number;
  workerId?: number;
}

export interface CreateTaskPayload {
  title: string;
  reward: number;
  description: string;
  /** ISO-время, когда задача перестаёт быть активной; null — без срока. */
  expiresAt: string | null;
  assigneeId: string;
}

export interface UpdateTaskPayload extends CreateTaskPayload {
  id: string;
  /** Задание с сервера: правится через PATCH, у моковых — нет. */
  serverTaskId?: string;
}

/** Смена статуса ребёнком: I did it! (review) или «Переделать» (active). */
export interface TaskStatusPayload {
  id: string;
  status: Exclude<TaskState, 'done'>;
}

/** Отказ родителя на проверке: задание снова активно, с причиной. */
export interface RejectTaskPayload {
  id: string;
  reason: RejectReasonKey;
  comment: string;
}

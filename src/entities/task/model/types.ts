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
  /** Шаги чеклиста по порядку; пустой — без чеклиста. */
  checklist: ChecklistStepPayload[];
}

/**
 * Шаг чеклиста в форме: у сохранённого шага есть `id` (при правке сервер
 * оставит ему отметку ребёнка), у нового — нет.
 */
export interface ChecklistStepPayload {
  id?: string;
  title: string;
}

/** Ребёнок отметил шаг чеклиста или снял отметку. */
export interface ChecklistTickPayload {
  /** id задачи в приложении (у задания с сервера — id назначения). */
  id: string;
  serverTaskId?: string;
  itemId: string;
  done: boolean;
}

export interface UpdateTaskPayload extends CreateTaskPayload {
  id: string;
  /** Задание с сервера: правится через PATCH, у моковых — нет. */
  serverTaskId?: string;
}

/** Смена статуса ребёнком: I did it! (review) или «Переделать» (active). */
export interface TaskStatusPayload {
  id: string;
  /**
   * Задание с сервера: на проверку — отчёт по назначению (`id`), обратно —
   * отзыв отчёта (Redo). У моковых — нет.
   */
  serverTaskId?: string;
  /** Redo задания с сервера: отчёт, который отзываем. */
  submissionId?: string;
  status: Exclude<TaskState, 'done'>;
  /** Комментарий ребёнка к сдаче (только на проверку); пустой — без него. */
  note?: string;
}

/** Отказ родителя на проверке: задание снова активно, с причиной. */
export interface RejectTaskPayload {
  id: string;
  reason: RejectReasonKey;
  comment: string;
}

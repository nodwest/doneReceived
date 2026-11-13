import type { Task } from '../model/task';
import type {
  ChecklistTickPayload,
  CreateTaskPayload,
  RejectTaskPayload,
  TaskStatusPayload,
  UpdateTaskPayload,
} from '../model/types';
import {
  cancelServerTask,
  createServerTask,
  fetchServerTasks,
  REJECT_REASON_CODES,
  reviewServerSubmission,
  submitServerTask,
  tickServerChecklist,
  updateServerTask,
  withdrawServerSubmission,
  type TaskViewer,
} from './server-tasks-api';

// Эндпоинты задач: всё — на сервере, в семье вошедшего.

/** Семья нужна каждому запросу: без неё (ещё не загрузилась) — ошибка. */
function family(familyId: string | null) {
  if (!familyId) throw new Error('No family');
  return familyId;
}

/** Задания семьи (ребёнку — только свои); без семьи — пусто. */
export async function fetchTasks(viewer: TaskViewer | null): Promise<Task[]> {
  if (!viewer) return [];
  return fetchServerTasks(viewer);
}

/** Создать задание ребёнку семьи: награда резервируется у автора. */
export async function createTask(
  payload: CreateTaskPayload,
  familyId: string | null,
): Promise<void> {
  await createServerTask(family(familyId), payload);
}

/** Править задание (PATCH, только автор). */
export async function updateTask(
  payload: UpdateTaskPayload,
  familyId: string | null,
): Promise<void> {
  await updateServerTask(family(familyId), payload);
}

/** Родитель отменил задание: резерв вернётся в кошелёк. */
export async function cancelTask(
  task: Task,
  familyId: string | null,
): Promise<void> {
  if (!task.serverTaskId) throw new Error('No server task');
  await cancelServerTask(family(familyId), task.serverTaskId);
}

/**
 * Ребёнок: «I did it!» (review) — отчёт на проверку, Redo (active) — отзыв
 * непроверенного отчёта.
 */
export async function setTaskStatus(
  payload: TaskStatusPayload,
  familyId: string | null,
): Promise<void> {
  if (payload.status === 'review') {
    await submitServerTask(family(familyId), payload.id, payload.note);
    return;
  }
  await withdrawServerSubmission(family(familyId), {
    id: payload.id,
    submissionId: payload.submissionId,
  });
}

/** Ребёнок отметил шаг чеклиста или снял отметку (`id` — назначение). */
export async function tickChecklistItem(
  payload: ChecklistTickPayload,
  familyId: string | null,
): Promise<void> {
  await tickServerChecklist(
    family(familyId),
    payload.id,
    payload.itemId,
    payload.done,
  );
}

/** Родитель подтвердил задание: награда из резерва уходит ребёнку. */
export async function approveTask(
  task: Task,
  familyId: string | null,
): Promise<void> {
  await reviewServerSubmission(family(familyId), task, {
    decision: 'approved',
  });
}

/**
 * Родитель отклонил задание: с `retry` — на переделку (снова активно с
 * причиной, награда в резерве), без — закрыто (резерв возвращается).
 */
export async function rejectTask(
  payload: RejectTaskPayload & { submissionId?: string },
  familyId: string | null,
): Promise<void> {
  await reviewServerSubmission(family(familyId), payload, {
    decision: 'rejected',
    reasonCode: REJECT_REASON_CODES[payload.reason],
    ...(payload.comment ? { comment: payload.comment } : {}),
    retry: payload.retry,
  });
}

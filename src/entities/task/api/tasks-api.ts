import type { Task } from '../model/task';
import type {
  ChecklistTickPayload,
  CreateTaskPayload,
  RejectTaskPayload,
  TaskStatusPayload,
  UpdateTaskPayload,
} from '../model/types';
import { mockServer } from './mock-server';
import {
  cancelServerTask,
  createServerTask,
  fetchServerTasks,
  reviewServerSubmission,
  submitServerTask,
  tickServerChecklist,
  updateServerTask,
  withdrawServerSubmission,
  type TaskViewer,
} from './server-tasks-api';

// Эндпоинты задач. Задания настоящих детей (их id — UUID) ходят в API,
// моковых Emma и Liam — в mockServer, пока их профили и кошельки на моках.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Ребёнок с сервера (UUID), а не моковый. */
export const isServerChild = (childId: string) => UUID.test(childId);

/**
 * Все задачи: моковые и, если есть семья, с сервера. Сервер не ответил —
 * показываем моковые, чтобы экраны не пустели.
 */
export async function fetchTasks(viewer: TaskViewer | null): Promise<Task[]> {
  const mocks = mockServer.list();
  if (!viewer) return mocks;
  const server = await fetchServerTasks(viewer).catch(() => [] as Task[]);
  return [...server, ...mocks];
}

/** Создать задание: настоящему ребёнку — на сервере, моковому — в моках. */
export async function createTask(
  payload: CreateTaskPayload,
  familyId: string | null,
): Promise<void> {
  if (isServerChild(payload.assigneeId)) {
    if (!familyId) throw new Error('No family');
    await createServerTask(familyId, payload);
    return;
  }
  mockServer.create(payload);
}

/** Править задание: с сервера — PATCH, моковое — в моках. */
export async function updateTask(
  payload: UpdateTaskPayload,
  familyId: string | null,
): Promise<void> {
  if (payload.serverTaskId) {
    if (!familyId) throw new Error('No family');
    await updateServerTask(familyId, payload);
    return;
  }
  mockServer.update(payload);
}

/** Родитель отменил задание: с сервера — резерв вернётся в кошелёк. */
export async function cancelTask(
  task: Task,
  familyId: string | null,
): Promise<void> {
  if (task.serverTaskId) {
    if (!familyId) throw new Error('No family');
    await cancelServerTask(familyId, task.serverTaskId);
    return;
  }
  mockServer.cancel(task.id);
}

/**
 * Ребёнок: «I did it!» (review) — отчёт на проверку, Redo (active) — отзыв
 * непроверенного отчёта. С сервера — по назначению, моковое — в моках.
 */
export async function setTaskStatus(
  payload: TaskStatusPayload,
  familyId: string | null,
): Promise<void> {
  if (payload.serverTaskId) {
    if (!familyId) throw new Error('No family');
    if (payload.status === 'review') {
      await submitServerTask(familyId, payload.id, payload.note);
    } else {
      await withdrawServerSubmission(familyId, {
        id: payload.id,
        submissionId: payload.submissionId,
      });
    }
    return;
  }
  mockServer.setStatus(payload);
}

/**
 * Ребёнок отметил шаг чеклиста или снял отметку: с сервера — по назначению
 * (`id`), моковое — в моках.
 */
export async function tickChecklistItem(
  payload: ChecklistTickPayload,
  familyId: string | null,
): Promise<void> {
  if (payload.serverTaskId) {
    if (!familyId) throw new Error('No family');
    await tickServerChecklist(
      familyId,
      payload.id,
      payload.itemId,
      payload.done,
    );
    return;
  }
  mockServer.tickChecklist(payload);
}

/**
 * Родитель подтвердил задание на проверке: оно выполнено (done). С сервера
 * награда из резерва уходит ребёнку.
 */
export async function approveTask(
  task: Task,
  familyId: string | null,
): Promise<void> {
  if (task.serverTaskId) {
    if (!familyId) throw new Error('No family');
    await reviewServerSubmission(familyId, task, { decision: 'approved' });
    return;
  }
  mockServer.approve(task.id);
}

/**
 * Родитель отклонил задание. Моковое — снова активно с причиной. С сервера —
 * пока закрывается, резерв возвращается родителю; `reasonText` — причина
 * для сервера словами.
 */
export async function rejectTask(
  payload: RejectTaskPayload & {
    serverTaskId?: string;
    submissionId?: string;
    reasonText: string;
  },
  familyId: string | null,
): Promise<void> {
  if (payload.serverTaskId) {
    if (!familyId) throw new Error('No family');
    await reviewServerSubmission(familyId, payload, {
      decision: 'rejected',
      reason: payload.reasonText,
    });
    return;
  }
  mockServer.reject(payload);
}

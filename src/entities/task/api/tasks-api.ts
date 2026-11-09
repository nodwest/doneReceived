import type { Task } from '../model/task';
import type {
  CreateTaskPayload,
  RejectTaskPayload,
  TaskStatusPayload,
  UpdateTaskPayload,
} from '../model/types';
import { mockServer } from './mock-server';

// Эндпоинты задач. Пока бэкенда нет, тела ходят в mockServer; с API здесь
// будут запросы (GET /tasks, POST /tasks, PATCH /tasks/:id,
// PATCH /tasks/:id/status, POST /tasks/:id/approve, POST /tasks/:id/reject,
// DELETE /tasks/:id), сигнатуры и весь остальной код не меняются.

export async function fetchTasks(): Promise<Task[]> {
  return mockServer.list();
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  return mockServer.create(payload);
}

export async function updateTask(payload: UpdateTaskPayload): Promise<Task> {
  return mockServer.update(payload);
}

export async function setTaskStatus(payload: TaskStatusPayload): Promise<Task> {
  return mockServer.setStatus(payload);
}

/** Родитель подтвердил задание на проверке: оно выполнено (done). */
export async function approveTask(id: number): Promise<Task> {
  return mockServer.approve(id);
}

/** Родитель вернул задание с причиной: оно снова активно. */
export async function rejectTask(payload: RejectTaskPayload): Promise<Task> {
  return mockServer.reject(payload);
}

/** Родитель отменил задание. */
export async function cancelTask(id: number): Promise<void> {
  mockServer.cancel(id);
}

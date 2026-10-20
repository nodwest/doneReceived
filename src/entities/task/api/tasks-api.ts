import type { Task } from '../model/task';
import type { CreateTaskPayload, UpdateTaskPayload } from '../model/types';
import { mockServer } from './mock-server';

// Эндпоинты задач. Пока бэкенда нет, тела ходят в mockServer; с API здесь
// будут запросы (GET /tasks, POST /tasks, PATCH /tasks/:id), сигнатуры и
// весь остальной код не меняются.

export async function fetchTasks(): Promise<Task[]> {
  return mockServer.list();
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  return mockServer.create(payload);
}

export async function updateTask(payload: UpdateTaskPayload): Promise<Task> {
  return mockServer.update(payload);
}

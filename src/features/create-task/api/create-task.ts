import type { CreateTaskPayload } from '@entities/task';

// Заглушка до появления бэкенда: заменить тело на реальный запрос,
// сигнатура и остальной код фичи менять не нужно.
export async function createTaskRequest(
  payload: CreateTaskPayload,
): Promise<CreateTaskPayload> {
  return payload;
}

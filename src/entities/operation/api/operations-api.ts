import type { Operation } from '../model/operation';
import { mockServer } from './mock-server';

// Эндпоинты истории операций. Пока бэкенда нет, тело ходит в mockServer; с API
// здесь будет запрос (GET /operations), сигнатура и остальной код не меняются.

export async function fetchOperations(): Promise<Operation[]> {
  return mockServer.list();
}

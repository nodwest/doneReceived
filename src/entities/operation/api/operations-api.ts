import type { Operation, RewardPayload } from '../model/operation';
import { mockServer } from './mock-server';

// Эндпоинты истории операций. Пока бэкенда нет, тело ходит в mockServer; с API
// здесь будут запросы (GET /operations; награду при подтверждении задания
// сервер запишет сам), сигнатуры и остальной код не меняются.

export async function fetchOperations(): Promise<Operation[]> {
  return mockServer.list();
}

/** Награда за подтверждённое задание: начислена сейчас. */
export async function addReward(payload: RewardPayload): Promise<Operation> {
  return mockServer.addReward(payload);
}

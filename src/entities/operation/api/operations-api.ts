import type { Operation, RewardPayload } from '../model/operation';
import { mockServer } from './mock-server';
import {
  fetchServerOperations,
  type OperationsViewer,
} from './server-operations-api';

// Эндпоинты истории операций: моковые (Emma и Liam) и, если есть семья,
// собранные из кошельков детей и заданий на сервере.

export async function fetchOperations(
  viewer: OperationsViewer | null,
): Promise<Operation[]> {
  const mocks = mockServer.list();
  if (!viewer) return mocks;
  // Сервер не ответил — показываем моковые, чтобы экраны не пустели.
  const server = await fetchServerOperations(viewer).catch(
    () => [] as Operation[],
  );
  return [...server, ...mocks];
}

/** Награда за подтверждённое моковое задание: начислена сейчас. */
export async function addReward(payload: RewardPayload): Promise<Operation> {
  return mockServer.addReward(payload);
}

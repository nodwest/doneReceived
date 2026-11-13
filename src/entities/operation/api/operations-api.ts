import type { Operation } from '../model/operation';
import {
  fetchServerOperations,
  type OperationsViewer,
} from './server-operations-api';

// История наград: собрана на сервере из кошельков детей и упущенных
// назначений.

/** История наград семьи (ребёнку — только его); без семьи — пусто. */
export async function fetchOperations(
  viewer: OperationsViewer | null,
): Promise<Operation[]> {
  if (!viewer) return [];
  return fetchServerOperations(viewer);
}

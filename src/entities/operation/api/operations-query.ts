import { queryOptions, useQuery } from '@tanstack/react-query';
import { sortByNewest } from '../model/operation';
import { fetchOperations } from './operations-api';
import type { OperationsViewer } from './server-operations-api';
import { queryRoots } from '@shared/api';

export type { OperationsViewer };

/** Ключи кэша истории операций. */
export const operationKeys = {
  all: queryRoots.operations,
  list: (familyId: string | null, childId?: string) =>
    [...operationKeys.all, 'list', familyId, childId ?? null] as const,
};

export const operationsQueryOptions = (viewer: OperationsViewer | null) =>
  queryOptions({
    queryKey: operationKeys.list(viewer?.familyId ?? null, viewer?.child?.id),
    queryFn: () => fetchOperations(viewer),
  });

/**
 * Вся история операций семьи (у вошедшего ребёнка — его), сначала новые.
 * viewer null — без семьи, только моки.
 */
export function useOperations(viewer: OperationsViewer | null = null) {
  // select со стабильной функцией: список пересортировывается только при новых данных.
  return useQuery({ ...operationsQueryOptions(viewer), select: sortByNewest });
}

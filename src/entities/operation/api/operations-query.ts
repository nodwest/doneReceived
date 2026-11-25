import { queryOptions, useQuery } from '@tanstack/react-query';
import { sortByNewest } from '../model/operation';
import { fetchOperations } from './operations-api';
import {
  fetchRewardById,
  fetchRewardPeriod,
  type OperationsViewer,
  type RewardPeriod,
} from './server-operations-api';
import {
  privateReadOptions,
  queryRoots,
  usePrivateReadScope,
} from '@shared/api';

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

export function useRewardPeriod(
  viewer: OperationsViewer | null,
  period: RewardPeriod,
  childFilter: string,
) {
  const scope = usePrivateReadScope();
  return useQuery({
    ...privateReadOptions,
    queryKey: [
      ...operationKeys.all,
      'period',
      scope,
      viewer?.userId,
      viewer?.familyId,
      viewer?.child?.id,
      period,
      childFilter,
    ],
    enabled: scope !== null && viewer !== null,
    queryFn: ({ signal }) =>
      fetchRewardPeriod(viewer!, period, childFilter, signal),
  });
}

export function useRewardById(
  viewer: OperationsViewer | null,
  id: string | undefined,
) {
  const scope = usePrivateReadScope();
  return useQuery({
    ...privateReadOptions,
    queryKey: [
      ...operationKeys.all,
      'reward',
      scope,
      viewer?.userId,
      viewer?.familyId,
      viewer?.child?.id,
      id,
    ],
    enabled: scope !== null && viewer !== null && id !== undefined,
    queryFn: ({ signal }) => fetchRewardById(viewer!, id!, signal),
  });
}

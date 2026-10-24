import { queryOptions, useQuery } from '@tanstack/react-query';
import { sortByNewest } from '../model/operation';
import { fetchOperations } from './operations-api';

/** Ключи кэша истории операций. */
export const operationKeys = {
  all: ['operations'] as const,
  list: () => [...operationKeys.all, 'list'] as const,
};

export const operationsQueryOptions = () =>
  queryOptions({ queryKey: operationKeys.list(), queryFn: fetchOperations });

/** Вся история операций семьи, сначала новые. */
export function useOperations() {
  // select со стабильной функцией: список пересортировывается только при новых данных.
  return useQuery({ ...operationsQueryOptions(), select: sortByNewest });
}

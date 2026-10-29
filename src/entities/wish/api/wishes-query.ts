import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchWishes } from './wishes-api';

/** Ключи кэша вишлистов: мутации инвалидируют wishKeys.all. */
export const wishKeys = {
  all: ['wishes'] as const,
  list: (childId: number) => [...wishKeys.all, 'list', childId] as const,
};

export const wishesQueryOptions = (childId: number) =>
  queryOptions({
    queryKey: wishKeys.list(childId),
    queryFn: () => fetchWishes(childId),
  });

/** Вишлист ребёнка в порядке приоритета. */
export function useWishes(childId: number) {
  return useQuery(wishesQueryOptions(childId));
}

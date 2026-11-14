import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import type { WishlistOwner } from '../model/wish';
import { fetchWishes } from './wishes-api';
import { queryRoots } from '@shared/api';

/** Ключи кэша вишлистов: мутации инвалидируют wishKeys.all. */
export const wishKeys = {
  all: queryRoots.wishes,
  list: (childId: string) => [...wishKeys.all, 'list', childId] as const,
};

/** owner null — ребёнок ещё не известен, запроса нет. */
export const wishesQueryOptions = (owner: WishlistOwner | null) =>
  queryOptions({
    queryKey: wishKeys.list(owner?.childId ?? ''),
    queryFn: owner ? () => fetchWishes(owner) : skipToken,
  });

/** Вишлист ребёнка в порядке приоритета. */
export function useWishes(owner: WishlistOwner | null) {
  return useQuery(wishesQueryOptions(owner));
}

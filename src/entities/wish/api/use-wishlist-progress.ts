import { useMemo } from 'react';
import { allocateBalance, summarizeWishlist } from '../model/allocate';
import { useWishes } from './wishes-query';

/**
 * Вишлист ребёнка, наполненный его балансом сверху вниз: у каждого желания
 * статус и накопленное, плюс сводка для плитки (готовые и текущее). Порядок
 * сам выходит «готовые → текущее → ожидающие».
 */
export function useWishlistProgress(childId: number, balance: number) {
  const query = useWishes(childId);
  const progress = useMemo(
    () => allocateBalance(query.data ?? [], balance),
    [query.data, balance],
  );
  return { ...query, progress, ...summarizeWishlist(progress) };
}

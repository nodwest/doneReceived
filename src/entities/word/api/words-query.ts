import { skipToken, useQuery } from '@tanstack/react-query';
import { queryRoots } from '@shared/api';
import { fetchWordsState } from './words-api';

/** Ключи кэша слов дня. */
export const wordKeys = {
  all: queryRoots.words,
  state: (familyId: string | null, childId: string | null) =>
    [...wordKeys.all, familyId, childId] as const,
};

/**
 * Слова ребёнка с сервера: включены ли, награда, сколько выучено и текущая
 * порция. Без семьи или ребёнка запроса нет.
 */
export function useWordsState(familyId: string | null, childId: string | null) {
  return useQuery({
    queryKey: wordKeys.state(familyId, childId),
    queryFn:
      familyId && childId
        ? () => fetchWordsState(familyId, childId)
        : skipToken,
  });
}

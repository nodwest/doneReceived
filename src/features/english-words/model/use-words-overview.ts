import { useMemo } from 'react';
import type { Task } from '@entities/task';
import { useChildWallet } from '@entities/wallet';
import { useWordsState } from '@entities/word';
import {
  getWordsOverview,
  wordsRewardsOf,
  type WordsOverview,
} from './words-overview';

/**
 * Слова ребёнка для экранов: состояние с сервера, задание порции из `tasks`
 * (задания этого ребёнка или всей семьи) и награды за слова из его кошелька.
 * Пока состояние грузится — overview null.
 */
export function useWordsOverview(
  familyId: string | null,
  childId: string | null,
  tasks: readonly Task[],
): {
  overview: WordsOverview | null;
  isPending: boolean;
  rewards: ReturnType<typeof wordsRewardsOf>;
} {
  const state = useWordsState(familyId, childId);
  const { data: wallet } = useChildWallet(childId, familyId);
  const rewards = useMemo(() => wordsRewardsOf(wallet), [wallet]);
  const overview = useMemo(
    () =>
      state.data
        ? getWordsOverview(
            state.data,
            tasks.filter((task) => task.assignee.id === childId),
            rewards,
          )
        : null,
    [state.data, tasks, childId, rewards],
  );
  return {
    overview,
    isPending: !!familyId && !!childId && state.isPending,
    rewards,
  };
}

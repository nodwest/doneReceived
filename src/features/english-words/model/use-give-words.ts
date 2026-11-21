import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@entities/task';
import {
  WORDS_REWARD,
  wordsInRange,
  wordStepTitle,
  wordsTaskTitle,
  type WordsRange,
} from '@entities/word';
import { hasApiErrorCode, isApiError, syncData } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { getWordsReward } from './settings-store';
import { useWordsFamilyId } from './use-words-family-id';

const requestId = () =>
  `words-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/** Ключ ошибки выдачи слов: `words.errors.*`. */
export function giveWordsError(error: unknown) {
  if (!isApiError(error)) return 'failed' as const;
  if (error.status === 0) return 'network' as const;
  if (hasApiErrorCode(error, 'INSUFFICIENT_FUNDS')) return 'noFunds' as const;
  return 'failed' as const;
}

/**
 * Выдать ребёнку слова: задание `English words v2 #from–to` с чеклистом из
 * слов и наградой за день, которую выбрал родитель (не выбрал —
 * WORDS_REWARD); она резервируется в его кошельке.
 */
export function createWordsTask(
  familyId: string | null,
  childId: string,
  range: WordsRange,
  description: (words: string) => string,
) {
  const words = wordsInRange(range);
  return createTask(
    {
      title: wordsTaskTitle(range),
      reward: getWordsReward(familyId) ?? WORDS_REWARD,
      description: description(words.map((word) => word.word).join(', ')),
      expiresAt: null,
      assigneeId: childId,
      clientRequestId: requestId(),
      checklist: words.map((word) => ({ title: wordStepTitle(word) })),
    },
    familyId,
  );
}

/** Родитель выдаёт слова вручную (первая порция или после паузы). */
export function useGiveWords() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const familyId = useWordsFamilyId();
  return useMutation({
    mutationFn: ({ childId, range }: { childId: string; range: WordsRange }) =>
      createWordsTask(familyId, childId, range, (words) =>
        t('words.taskDescription', { words }),
      ),
    onSettled: () => syncData(queryClient, 'task-created'),
  });
}

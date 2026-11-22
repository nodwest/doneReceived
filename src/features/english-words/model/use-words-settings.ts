import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  saveWordsSettings,
  WORDS_PER_DAY,
  wordKeys,
  type WordsState,
} from '@entities/word';
import { hasApiErrorCode, isApiError, syncData } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';

/** Часовой пояс телефона родителя: по нему у семьи начинается день слов. */
function deviceTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

/** Ключ ошибки настроек: `words.errors.*`. */
function settingsError(error: unknown) {
  if (!isApiError(error)) return 'failed' as const;
  if (error.status === 0) return 'network' as const;
  if (hasApiErrorCode(error, 'INSUFFICIENT_FUNDS')) return 'noFunds' as const;
  return 'failed' as const;
}

type SaveWordsSettings = {
  childId: string;
  enabled: boolean;
  rewardPoints: number;
};

/**
 * Родитель включает слова ребёнку или меняет награду за день: сервер
 * сохраняет настройки (плательщик — этот родитель) и при включении сразу
 * выдаёт первую порцию, резервируя награду. Не хватило денег — настройки
 * всё равно сохранены, порция ждёт пополнения (тост).
 */
export function useSaveWordsSettings(familyId: string | null) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ childId, enabled, rewardPoints }: SaveWordsSettings) => {
      if (!familyId) throw new Error('No family');
      return saveWordsSettings(familyId, childId, {
        enabled,
        rewardPoints,
        wordsPerDay: WORDS_PER_DAY,
        timeZone: deviceTimeZone(),
      });
    },
    onSuccess: (state, { childId }) => {
      queryClient.setQueryData<WordsState>(
        wordKeys.state(familyId, childId),
        state,
      );
    },
    onError: (error) => showToast(t(`words.errors.${settingsError(error)}`)),
    onSettled: () => syncData(queryClient, 'words-changed'),
  });
}

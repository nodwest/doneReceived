import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@entities/task';
import { checkWords } from '@entities/word';
import { hasApiErrorCode, isApiError, syncData } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { useWordsFamilyId } from './use-words-family-id';

/** Ключ ошибки проверки: `words.errors.*`. */
function checkError(error: unknown) {
  if (!isApiError(error)) return 'failed' as const;
  if (error.status === 0) return 'network' as const;
  if (error.status === 409 || hasApiErrorCode(error, 'TASK_NOT_ON_REVIEW')) {
    return 'alreadyChecked' as const;
  }
  return 'failed' as const;
}

type CheckWords = {
  task: Task;
  /** Ответ на каждое слово порции: новые и пройденные. */
  answers: { rank: number; correct: boolean }[];
};

/**
 * Итог проверки слов родителем — на сервер целиком. Всё верно — награда из
 * резерва уходит ребёнку, следующие слова сервер выдаст завтра в 4:00. Есть
 * ошибки — слова снова у ребёнка, в отказе — какие не вспомнил.
 */
export function useCheckWords() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const familyId = useWordsFamilyId();
  return useMutation({
    mutationFn: ({ task, answers }: CheckWords) => {
      if (!familyId || !task.submissionId) throw new Error('No submission');
      return checkWords(familyId, task.submissionId, answers);
    },
    onError: (error) => showToast(t(`words.errors.${checkError(error)}`)),
    // Не знаем итога (ошибка) — перечитываем всё, что задевает выплата.
    onSettled: (result) =>
      syncData(
        queryClient,
        result && !result.passed ? 'task-rejected' : 'task-approved',
      ),
  });
}

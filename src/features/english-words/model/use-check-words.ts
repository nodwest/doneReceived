import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveTask, rejectTask, type Task } from '@entities/task';
import { nextWordsRange, parseWordsRange } from '@entities/word';
import { isApiError, syncData } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { createWordsTask, giveWordsError } from './use-give-words';
import { useWordsFamilyId } from './use-words-family-id';

/** Ключ ошибки проверки: `words.errors.*`. */
function checkError(error: unknown) {
  if (!isApiError(error)) return 'failed' as const;
  if (error.status === 0) return 'network' as const;
  if (error.status === 409) return 'alreadyChecked' as const;
  return 'failed' as const;
}

/**
 * Итог проверки слов родителем. Всё верно — Approve: награда из резерва
 * уходит ребёнку, и сразу выдаются следующие слова (откроются завтра).
 * Есть ошибки — отказ с переделкой: слова снова у ребёнка, в комментарии —
 * что не вспомнил.
 */
export function useCheckWords() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const familyId = useWordsFamilyId();

  const approve = useMutation({
    mutationFn: async (task: Task) => {
      await approveTask(task, familyId);
      // Следующая порция: после последнего слова этого задания.
      const range = parseWordsRange(task.title);
      const next = range ? nextWordsRange(range.to) : null;
      if (!next) return;
      try {
        await createWordsTask(familyId, task.assignee.id, next, (words) =>
          t('words.taskDescription', { words }),
        );
      } catch (error) {
        // Награда уже выплачена — проверка удалась. Следующие слова можно
        // выдать вручную на вкладке Languages.
        showToast(t(`words.errors.next.${giveWordsError(error)}`));
      }
    },
    onError: (error) => showToast(t(`words.errors.${checkError(error)}`)),
    onSettled: async () => {
      await syncData(queryClient, 'task-approved');
      await syncData(queryClient, 'task-created');
    },
  });

  const reject = useMutation({
    mutationFn: ({ task, missed }: { task: Task; missed: string[] }) =>
      rejectTask(
        {
          id: task.id,
          submissionId: task.submissionId,
          reason: 'other',
          comment: t('words.rejectComment', { words: missed.join(', ') }),
          retry: true,
        },
        familyId,
      ),
    onError: (error) => showToast(t(`words.errors.${checkError(error)}`)),
    onSettled: () => syncData(queryClient, 'task-rejected'),
  });

  return { approve, reject };
}

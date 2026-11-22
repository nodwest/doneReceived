import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setTaskStatus, taskKeys, type Task } from '@entities/task';
import { wordKeys, type WordsState } from '@entities/word';
import { syncData } from '@shared/api';
import { useWordsFamilyId } from './use-words-family-id';

/**
 * Все слова запомнены — порция уходит на проверку родителю (как I did it!,
 * без фото и комментария). В кэше задание и слова сразу «на проверке»,
 * чтобы экран не показал слова заново, пока данные перечитываются.
 */
export function useSubmitWords() {
  const queryClient = useQueryClient();
  const familyId = useWordsFamilyId();
  return useMutation({
    mutationFn: (task: Task) =>
      setTaskStatus({ id: task.id, status: 'review' }, familyId),
    onSuccess: (_, task) => {
      queryClient.setQueryData<Task[]>(taskKeys.list(familyId), (tasks) =>
        tasks?.map((item) =>
          item.id === task.id ? { ...item, status: 'review' } : item,
        ),
      );
      queryClient.setQueryData<WordsState>(
        wordKeys.state(familyId, task.assignee.id),
        (state) => (state ? { ...state, status: 'review' } : state),
      );
    },
    onSettled: () => syncData(queryClient, 'task-submitted'),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setTaskStatus, taskKeys, type Task } from '@entities/task';
import { syncData } from '@shared/api';
import { useWordsFamilyId } from './use-words-family-id';

/**
 * Все слова запомнены — задание уходит на проверку родителю (как I did it!).
 * В кэше оно сразу становится «на проверке», чтобы экран не показал слова
 * заново, пока список перечитывается.
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
    },
    onSettled: () => syncData(queryClient, 'task-submitted'),
  });
}

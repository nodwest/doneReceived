import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';
import { setTaskStatus, taskKeys, type Task } from '@entities/task';
import { wordKeys, type WordsState } from '@entities/word';
import { syncData, usePrivateReadScope } from '@shared/api';
import { useWordsFamilyId } from './use-words-family-id';

/**
 * Все слова запомнены — порция уходит на проверку родителю (как I did it!,
 * без фото и комментария). В кэше задание и слова сразу «на проверке»,
 * чтобы экран не показал слова заново, пока данные перечитываются.
 */
export function useSubmitWords() {
  const queryClient = useQueryClient();
  const familyId = useWordsFamilyId();
  const family = useCurrentFamily();
  const user = useSessionUser();
  const scope = usePrivateReadScope();
  const taskKey = taskKeys.list(
    familyId,
    user?.id,
    family?.role ?? user?.family?.role,
    scope,
  );
  return useMutation({
    mutationFn: (task: Task) =>
      setTaskStatus({ id: task.id, status: 'review' }, familyId),
    onMutate: (task) => {
      const wordKey = wordKeys.state(familyId, task.assignee.id);
      return {
        wordKey,
        wordQuery: queryClient.getQueryCache().find({ queryKey: wordKey }),
      };
    },
    onSuccess: (_, task, context) => {
      queryClient.setQueryData<Task[]>(taskKey, (tasks) =>
        tasks?.map((item) =>
          item.id === task.id ? { ...item, status: 'review' } : item,
        ),
      );
      if (
        context?.wordQuery &&
        context.wordQuery ===
          queryClient.getQueryCache().find({ queryKey: context.wordKey })
      ) {
        queryClient.setQueryData<WordsState>(context.wordKey, (state) =>
          state ? { ...state, status: 'review' } : state,
        );
      }
    },
    onSettled: () => syncData(queryClient, 'task-submitted'),
  });
}

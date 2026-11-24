import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';
import {
  setTaskStatus,
  taskKeys,
  type Task,
  type TaskStatusPayload,
} from '@entities/task';
import { isApiError, syncData, usePrivateReadScope } from '@shared/api';
import { clearPrivateImageCache } from '@shared/ui';

/**
 * Ребёнок меняет статус задания: на проверку или обратно (Redo). Семья у
 * ребёнка — из сессии (список семей ему не грузим), у родителя в режиме
 * ребёнка — текущая.
 */
export function useSetTaskStatus() {
  const queryClient = useQueryClient();
  const family = useCurrentFamily();
  const user = useSessionUser();
  const scope = usePrivateReadScope();
  const familyId = family?.id ?? user?.family?.id ?? null;
  return useMutation({
    mutationFn: ({
      payload,
      signal,
    }: {
      payload: TaskStatusPayload;
      signal: AbortSignal;
    }) => {
      if (signal.aborted) throw new Error('Task action cancelled');
      return setTaskStatus(payload, familyId, signal);
    },
    retry: (count, error) => count < 1 && isAmbiguousTaskError(error),
    onSuccess: async (_, { payload, signal }) => {
      if (payload.status !== 'active' || signal.aborted || !scope) return;
      const queries = {
        queryKey: taskKeys.all,
        predicate: ({ queryKey }: { queryKey: readonly unknown[] }) =>
          queryKey[1] === 'list' &&
          queryKey[2] === familyId &&
          queryKey.at(-1) === scope,
      };
      await queryClient.cancelQueries(queries);
      if (signal.aborted) return;
      clearPrivateImageCache();
      queryClient.setQueriesData<Task[]>(queries, (tasks) =>
        tasks?.map((task) =>
          task.id === payload.id &&
          task.status === 'review' &&
          task.submissionId === payload.submissionId &&
          (!task.expiresAt || Date.parse(task.expiresAt) > Date.now())
            ? {
                ...task,
                status: 'active',
                submissionId: undefined,
                doneAt: null,
                photos: [],
                note: null,
              }
            : task,
        ),
      );
    },
    onSettled: (_, __, { payload: { status }, signal }) => {
      if (signal.aborted) return;
      if (status === 'review') return syncData(queryClient, 'task-submitted');
      void syncData(queryClient, 'task-withdrawn');
    },
  });
}

export function isAmbiguousTaskError(error: unknown) {
  return isApiError(error) && (error.status === 0 || error.status >= 500);
}

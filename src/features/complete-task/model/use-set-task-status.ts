import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';
import { setTaskStatus, type TaskStatusPayload } from '@entities/task';
import { isApiError, syncData } from '@shared/api';

/**
 * Ребёнок меняет статус задания: на проверку или обратно (Redo). Семья у
 * ребёнка — из сессии (список семей ему не грузим), у родителя в режиме
 * ребёнка — текущая.
 */
export function useSetTaskStatus() {
  const queryClient = useQueryClient();
  const family = useCurrentFamily();
  const user = useSessionUser();
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
    onSettled: (_, __, { payload: { status } }) =>
      syncData(
        queryClient,
        status === 'review' ? 'task-submitted' : 'task-withdrawn',
      ),
  });
}

export function isAmbiguousTaskError(error: unknown) {
  return isApiError(error) && (error.status === 0 || error.status >= 500);
}

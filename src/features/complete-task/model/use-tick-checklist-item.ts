import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';
import {
  taskKeys,
  tickChecklistItem,
  type ChecklistTickPayload,
  type Task,
} from '@entities/task';
import { syncData, usePrivateReadScope } from '@shared/api';

/** Ставит отметку шага во всех списках задач в кэше. */
const tick = (
  tasks: Task[] | undefined,
  { id, itemId, done }: ChecklistTickPayload,
) =>
  tasks?.map((task) =>
    task.id === id
      ? {
          ...task,
          checklist: task.checklist.map((item) =>
            item.id === itemId ? { ...item, done } : item,
          ),
        }
      : task,
  );

/**
 * Ребёнок отмечает шаг чеклиста или снимает отметку. Галочка ставится сразу
 * (в кэше), не дожидаясь сервера; ошибка возвращает как было. Семья — как в
 * `useSetTaskStatus`: у ребёнка из сессии.
 */
export function useTickChecklistItem() {
  const queryClient = useQueryClient();
  const family = useCurrentFamily();
  const user = useSessionUser();
  const familyId = family?.id ?? user?.family?.id ?? null;
  const scope = usePrivateReadScope();
  const queryKey = taskKeys.list(
    familyId,
    user?.id,
    family?.role ?? user?.family?.role,
    scope,
  );
  return useMutation({
    mutationFn: (payload: ChecklistTickPayload) =>
      tickChecklistItem(payload, familyId),
    onMutate: async (payload) => {
      // Фоновое перечитывание не должно затереть отметку до ответа сервера.
      const query = queryClient.getQueryCache().find({ queryKey });
      await queryClient.cancelQueries({ queryKey, exact: true });
      if (!query || query !== queryClient.getQueryCache().find({ queryKey }))
        return;
      const snapshot = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[]>(queryKey, (tasks) =>
        tick(tasks, payload),
      );
      return { query, snapshot, queryKey };
    },
    onError: (_error, _payload, context) => {
      if (
        context &&
        context.query ===
          queryClient.getQueryCache().find({ queryKey: context.queryKey })
      ) {
        queryClient.setQueryData(context.queryKey, context.snapshot);
      }
    },
    onSettled: () => syncData(queryClient, 'checklist-ticked'),
  });
}

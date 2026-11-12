import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';
import {
  taskKeys,
  tickChecklistItem,
  type ChecklistTickPayload,
  type Task,
} from '@entities/task';

type TasksSnapshot = [readonly unknown[], Task[] | undefined][];

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
  return useMutation({
    mutationFn: (payload: ChecklistTickPayload) =>
      tickChecklistItem(payload, familyId),
    onMutate: async (payload) => {
      // Фоновое перечитывание не должно затереть отметку до ответа сервера.
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const snapshot: TasksSnapshot = queryClient.getQueriesData<Task[]>({
        queryKey: taskKeys.all,
      });
      queryClient.setQueriesData<Task[]>({ queryKey: taskKeys.all }, (tasks) =>
        tick(tasks, payload),
      );
      return { snapshot };
    },
    onError: (_error, _payload, context) => {
      context?.snapshot.forEach(([key, tasks]) =>
        queryClient.setQueryData(key, tasks),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

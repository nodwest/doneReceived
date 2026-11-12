import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';
import {
  setTaskStatus,
  taskKeys,
  type TaskStatusPayload,
} from '@entities/task';

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
    mutationFn: (payload: TaskStatusPayload) =>
      setTaskStatus(payload, familyId),
    // Статус сменился: перечитываем список.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

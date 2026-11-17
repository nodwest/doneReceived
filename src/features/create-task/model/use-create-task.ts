import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { createTask, type CreateTaskPayload } from '@entities/task';
import { syncData } from '@shared/api';

/**
 * Создать задание на сервере: награда резервируется в кошельке — всё
 * связанное перечитывается (`syncData`).
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload, familyId),
    // onSettled, а не onSuccess: если ответ потерян, но сервер уже создал
    // задание, список всё равно перечитается и покажет его.
    onSettled: () => syncData(queryClient, 'task-created'),
  });
}

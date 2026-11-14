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
    // Мутация ждёт перечитывания: после закрытия формы задача уже на экране.
    onSuccess: () => syncData(queryClient, 'task-created'),
  });
}

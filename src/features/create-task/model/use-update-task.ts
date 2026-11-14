import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { updateTask, type UpdateTaskPayload } from '@entities/task';
import { syncData } from '@shared/api';

/**
 * Править задание: с сервера — PATCH (новая награда пересчитывает резерв,
 * поэтому кошелёк тоже перечитываем), моковое — в моках.
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;
  return useMutation({
    mutationFn: (payload: UpdateTaskPayload) => updateTask(payload, familyId),
    onSuccess: () => syncData(queryClient, 'task-updated'),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { createTask, taskKeys, type CreateTaskPayload } from '@entities/task';
import { walletKeys } from '@entities/wallet';

/**
 * Создать задание. Настоящему ребёнку — на сервере (награда резервируется в
 * кошельке, поэтому кошелёк тоже перечитываем), моковому — в моках.
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload, familyId),
    // Мутация ждёт перечитывания: после закрытия формы задача уже на экране.
    onSuccess: () =>
      Promise.all(
        [taskKeys.all, walletKeys.all].map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      ),
  });
}

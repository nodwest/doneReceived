import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, taskKeys } from '@entities/task';

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    // Задача создана: перечитываем список. Мутация ждёт перечитывания,
    // поэтому после закрытия формы новая задача уже на экране.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

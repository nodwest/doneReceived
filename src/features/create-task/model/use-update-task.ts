import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskKeys, updateTask } from '@entities/task';

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    // Задача обновлена: перечитываем список, как с настоящим сервером.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

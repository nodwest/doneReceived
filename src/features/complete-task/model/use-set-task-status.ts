import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setTaskStatus, taskKeys } from '@entities/task';

export function useSetTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setTaskStatus,
    // Статус сменился: перечитываем список, как с настоящим сервером.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

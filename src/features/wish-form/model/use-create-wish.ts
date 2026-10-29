import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWish, wishKeys } from '@entities/wish';

export function useCreateWish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWish,
    // Желание добавлено: перечитываем вишлист, как с настоящим сервером.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishKeys.all }),
  });
}

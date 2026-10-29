import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWish, wishKeys } from '@entities/wish';

export function useDeleteWish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWish,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishKeys.all }),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWish, wishKeys } from '@entities/wish';

export function useUpdateWish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWish,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishKeys.all }),
  });
}

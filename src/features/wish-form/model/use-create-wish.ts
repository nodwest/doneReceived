import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createWish,
  wishKeys,
  type WishlistOwner,
  type WishPayload,
} from '@entities/wish';

export function useCreateWish(owner: WishlistOwner | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: WishPayload) => {
      if (!owner) throw new Error('No wishlist owner');
      return createWish(owner, payload);
    },
    // Желание добавлено: перечитываем вишлист.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishKeys.all }),
  });
}

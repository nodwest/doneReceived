import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateWish,
  wishKeys,
  type UpdateWishPayload,
  type WishlistOwner,
} from '@entities/wish';

export function useUpdateWish(owner: WishlistOwner | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateWishPayload) => {
      if (!owner) throw new Error('No wishlist owner');
      return updateWish(owner, payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishKeys.all }),
  });
}

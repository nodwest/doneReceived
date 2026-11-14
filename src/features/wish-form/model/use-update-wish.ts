import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateWish,
  type UpdateWishPayload,
  type WishlistOwner,
} from '@entities/wish';
import { syncData } from '@shared/api';

export function useUpdateWish(owner: WishlistOwner | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateWishPayload) => {
      if (!owner) throw new Error('No wishlist owner');
      return updateWish(owner, payload);
    },
    // И после ошибки: желание могло сохраниться без фото.
    onSettled: () => syncData(queryClient, 'wish-changed'),
  });
}

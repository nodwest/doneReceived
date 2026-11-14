import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createWish,
  type WishlistOwner,
  type WishPayload,
} from '@entities/wish';
import { syncData } from '@shared/api';

export function useCreateWish(owner: WishlistOwner | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: WishPayload) => {
      if (!owner) throw new Error('No wishlist owner');
      return createWish(owner, payload);
    },
    // Перечитываем вишлист и после ошибки: желание могло сохраниться без фото.
    onSettled: () => syncData(queryClient, 'wish-changed'),
  });
}

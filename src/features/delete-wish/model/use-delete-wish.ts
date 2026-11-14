import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWish, type WishlistOwner } from '@entities/wish';
import { syncData } from '@shared/api';

export function useDeleteWish(owner: WishlistOwner | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!owner) throw new Error('No wishlist owner');
      return deleteWish(owner, id);
    },
    onSuccess: () => syncData(queryClient, 'wish-changed'),
  });
}

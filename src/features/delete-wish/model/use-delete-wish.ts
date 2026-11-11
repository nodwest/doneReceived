import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWish, wishKeys, type WishlistOwner } from '@entities/wish';

export function useDeleteWish(owner: WishlistOwner | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!owner) throw new Error('No wishlist owner');
      return deleteWish(owner, id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishKeys.all }),
  });
}

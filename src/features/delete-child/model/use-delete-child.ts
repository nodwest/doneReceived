import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteChild, familyKeys } from '@entities/family';

/** Удалить профиль ребёнка без устройства. */
export function useDeleteChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChild,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: familyKeys.newChildren() }),
  });
}

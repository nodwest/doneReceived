import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChild, familyKeys } from '@entities/family';

/** Создать профиль ребёнка: он сразу появляется на вкладке Family. */
export function useCreateChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChild,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: familyKeys.newChildren() }),
  });
}

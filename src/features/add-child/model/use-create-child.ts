import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChild, familiesKeys, useCurrentFamily } from '@entities/family';

/**
 * Создать профиль ребёнка в семье вошедшего родителя (POST
 * /families/:id/children): он сразу появляется на вкладке Family.
 */
export function useCreateChild() {
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;
  return useMutation({
    mutationFn: (name: string) => {
      if (!familyId) throw new Error('No family');
      return createChild(familyId, name);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: familiesKeys.children(familyId),
      }),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteChild, useCurrentFamily } from '@entities/family';
import { syncData } from '@shared/api';

export function useDeleteChild() {
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;
  return useMutation({
    mutationFn: ({
      childId,
      expectedBalancePoints,
    }: {
      childId: string;
      expectedBalancePoints?: string;
    }) => {
      if (!familyId) throw new Error('No family');
      return deleteChild(familyId, childId, expectedBalancePoints);
    },
    onSuccess: () => syncData(queryClient, 'child-changed'),
  });
}

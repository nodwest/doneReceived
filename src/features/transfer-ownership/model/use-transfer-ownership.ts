import { useMutation, useQueryClient } from '@tanstack/react-query';
import { familiesKeys, transferOwnership } from '@entities/family';

/**
 * Владелец передаёт семью другому родителю (`memberId` — id членства). После
 * этого роли в GET /families и в участниках меняются — перечитываем их.
 */
export function useTransferOwnership(familyId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => {
      if (!familyId) throw new Error('No family');
      return transferOwnership(familyId, memberId);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: familiesKeys.all }),
  });
}

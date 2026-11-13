import { useMutation, useQueryClient } from '@tanstack/react-query';
import { familiesKeys, revokeParentInvite } from '@entities/family';

/**
 * Сбросить код второго родителя: сервер гасит живой код (DELETE
 * …/invites/current), затем перечитываем код — сервер выдаёт новый. Успех
 * наступает, когда новый код уже в кэше. Сам не повторяется.
 */
export function useResetInviteCode(familyId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!familyId) throw new Error('No family');
      await revokeParentInvite(familyId);
      await queryClient.refetchQueries({
        queryKey: familiesKeys.parentInvite(familyId),
      });
    },
    retry: false,
  });
}

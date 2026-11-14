import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteChild, useCurrentFamily } from '@entities/family';
import { syncData } from '@shared/api';

/**
 * Удалить профиль ребёнка (DELETE /families/:id/children/:childId). Сервер
 * не даст удалить, пока на счету есть деньги или открытые задания (409).
 */
export function useDeleteChild() {
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;
  return useMutation({
    mutationFn: (childId: string) => {
      if (!familyId) throw new Error('No family');
      return deleteChild(familyId, childId);
    },
    onSuccess: () => syncData(queryClient, 'child-changed'),
  });
}

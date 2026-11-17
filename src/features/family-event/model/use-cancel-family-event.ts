import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';
import { cancelFamilyEvent } from '@entities/family-event';
import { syncData } from '@shared/api';

/** Отмена события родителем; экран пока не показывает удаление. */
export function useCancelFamilyEvent() {
  const queryClient = useQueryClient();
  const currentFamily = useCurrentFamily();
  const sessionUser = useSessionUser();
  const familyId = currentFamily?.id ?? sessionUser?.family?.id ?? null;

  return useMutation({
    mutationFn: (eventId: string) => {
      if (!familyId) throw new Error('Нет активной семьи.');
      return cancelFamilyEvent(familyId, eventId);
    },
    onSuccess: () => syncData(queryClient, 'calendar-changed'),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import {
  createFamilyEvent,
  familyEventsKeys,
  updateFamilyEvent,
  type FamilyEventPayload,
} from '@entities/family-event';
import { syncData } from '@shared/api';

export type SaveFamilyEventInput = {
  /** undefined — создать, иначе обновить это событие. */
  eventId?: string;
  payload: FamilyEventPayload;
};

/** Создание и правка: после ответа обновляем деталку и весь календарь. */
export function useSaveFamilyEvent() {
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;

  return useMutation({
    mutationFn: ({ eventId, payload }: SaveFamilyEventInput) => {
      if (!familyId) throw new Error('Нет активной семьи.');
      return eventId
        ? updateFamilyEvent(familyId, eventId, payload)
        : createFamilyEvent(familyId, payload);
    },
    onSuccess: async (event) => {
      if (familyId) {
        queryClient.setQueryData(
          familyEventsKeys.detail(familyId, event.id),
          event,
        );
      }
      await syncData(queryClient, 'calendar-changed');
    },
  });
}

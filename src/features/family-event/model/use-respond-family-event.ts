import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';
import {
  familyEventsKeys,
  respondToFamilyEvent,
  type FamilyEvent,
  type FamilyEventResponse,
} from '@entities/family-event';
import { syncData } from '@shared/api';

type RespondInput = {
  eventId: string;
  response: FamilyEventResponse;
};

/**
 * Личный ответ «Я еду / Я не еду». Сначала кладём его в деталку, затем
 * перечитываем календарь: список не должен показывать старый ответ.
 */
export function useRespondFamilyEvent() {
  const queryClient = useQueryClient();
  const currentFamily = useCurrentFamily();
  const sessionUser = useSessionUser();
  const familyId = currentFamily?.id ?? sessionUser?.family?.id ?? null;

  return useMutation({
    mutationFn: ({ eventId, response }: RespondInput) => {
      if (!familyId) throw new Error('Нет активной семьи.');
      return respondToFamilyEvent(familyId, eventId, response);
    },
    onSuccess: async (result, { eventId }) => {
      if (familyId) {
        const key = familyEventsKeys.detail(familyId, eventId);
        const event = queryClient.getQueryData<FamilyEvent>(key);
        if (event) {
          queryClient.setQueryData(key, {
            ...event,
            response: result.response,
          });
        }
      }
      await syncData(queryClient, 'calendar-changed');
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import {
  createFamilyEvent,
  familyEventsKeys,
  removeFamilyEventPhoto,
  updateFamilyEvent,
  uploadFamilyEventPhoto,
  type FamilyEventPayload,
} from '@entities/family-event';
import { authorizedImage, syncData } from '@shared/api';
import type { PickedPhoto } from '@shared/lib';

export type SaveFamilyEventInput = {
  /** undefined — создать, иначе обновить это событие. */
  eventId?: string;
  payload: FamilyEventPayload;
  cover?: PickedPhoto | null;
};

/** Создание и правка: после ответа обновляем деталку и весь календарь. */
export function useSaveFamilyEvent() {
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;

  return useMutation({
    mutationFn: async ({ eventId, payload, cover }: SaveFamilyEventInput) => {
      if (!familyId) throw new Error('Нет активной семьи.');
      const event = await (eventId
        ? updateFamilyEvent(familyId, eventId, payload)
        : createFamilyEvent(familyId, payload));

      try {
        if (cover) {
          const { url } = await uploadFamilyEventPhoto(
            familyId,
            event.id,
            cover,
          );
          return {
            event: { ...event, photo: authorizedImage(url) },
            photoFailed: false,
          };
        }
        if (cover === null) {
          await removeFamilyEventPhoto(familyId, event.id);
          return { event: { ...event, photo: undefined }, photoFailed: false };
        }
      } catch {
        return { event, photoFailed: true };
      }
      return { event, photoFailed: false };
    },
    onSuccess: async ({ event }) => {
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

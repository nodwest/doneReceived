import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import {
  createFamilyEvent,
  familyEventsKeys,
  removeFamilyEventPhoto,
  updateFamilyEvent,
  uploadFamilyEventPhoto,
  type FamilyEvent,
  type FamilyEventPayload,
} from '@entities/family-event';
import { authorizedImage, syncData } from '@shared/api';
import { photoUploadError, type PickedPhoto } from '@shared/lib';

export type SaveFamilyEventInput = {
  /** undefined — создать, иначе обновить это событие. */
  eventId?: string;
  payload: FamilyEventPayload;
  coverOnlyEvent?: FamilyEvent;
  cover?: PickedPhoto | null;
};

/** Создание и правка: после ответа обновляем деталку и весь календарь. */
export function useSaveFamilyEvent() {
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;

  return useMutation({
    mutationFn: async ({
      eventId,
      payload,
      coverOnlyEvent,
      cover,
    }: SaveFamilyEventInput) => {
      if (!familyId) throw new Error('Нет активной семьи.');
      const event =
        coverOnlyEvent ??
        (await (eventId
          ? updateFamilyEvent(familyId, eventId, payload)
          : createFamilyEvent(familyId, payload)));

      try {
        if (cover) {
          const { url } = await uploadFamilyEventPhoto(
            familyId,
            event.id,
            cover,
          );
          return {
            event: { ...event, photo: authorizedImage(url) },
            photoError: null,
            photoRemovalFailed: false,
          };
        }
        if (cover === null) {
          await removeFamilyEventPhoto(familyId, event.id);
          return {
            event: { ...event, photo: undefined },
            photoError: null,
            photoRemovalFailed: false,
          };
        }
      } catch (error) {
        return {
          event,
          photoError: cover ? photoUploadError(error) : null,
          photoRemovalFailed: cover === null,
        };
      }
      return { event, photoError: null, photoRemovalFailed: false };
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

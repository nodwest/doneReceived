import { authorizedImage, apiRequest } from '@shared/api';
import { appendPhoto, type PickedPhoto } from '@shared/lib';
import type {
  FamilyEvent,
  FamilyEventKind,
  FamilyEventResponse,
  FamilyEventRepeat,
} from '../model/family-event';
import { toFamilyEvent } from './family-event-mapper';
import type { components } from './generated/calendar';

/**
 * DTO ответа генерируется из `openapi/calendar.json` (календарный срез
 * Swagger бэкенда). Руками форму ответа здесь больше не описываем: при
 * переименовании поля ломается `tsc`, а не экран.
 */
type FamilyEventDto = components['schemas']['FamilyEventDto'];
type FamilyEventResponseDto = components['schemas']['FamilyEventResponseDto'];
type FamilyEventPhotoDto = components['schemas']['FamilyEventPhotoDto'];
type CreateFamilyEventRequestBody =
  components['schemas']['CreateFamilyEventDto'];
export type ManagedFamilyEvent = components['schemas']['ManagedFamilyEventDto'];
type ManagedFamilyEventsPage =
  components['schemas']['ManagedFamilyEventsPageDto'];

const mapEvent = (dto: FamilyEventDto) => toFamilyEvent(dto, authorizedImage);

export function fetchManagedFamilyEvents(
  familyId: string,
  cursor: string | null,
  signal: AbortSignal,
) {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
  return apiRequest<ManagedFamilyEventsPage>(
    `/families/${familyId}/events/manage${query}`,
    { signal },
  );
}

export type FamilyEventPayload = {
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  repeat: FamilyEventRepeat;
  kind: FamilyEventKind;
  reminderLeadMinutes: number | null;
  participants: string[];
  /** Только для создания: retry после потерянного ответа не создаёт дубль. */
  clientRequestId?: string;
};

const bodyOf = (payload: FamilyEventPayload): CreateFamilyEventRequestBody => ({
  title: payload.title,
  description: payload.description,
  startsAt: payload.startsAt.toISOString(),
  endsAt: payload.endsAt.toISOString(),
  timezone: payload.timezone,
  repeat: payload.repeat,
  kind: payload.kind,
  reminderLeadMinutes: payload.reminderLeadMinutes,
  participants: payload.participants,
});

/** GET /families/:id/events?from=&to= — не шире 92 дней. */
export async function fetchFamilyEvents(
  familyId: string,
  from: Date,
  to: Date,
): Promise<FamilyEvent[]> {
  const query = new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString(),
  });
  const events = await apiRequest<FamilyEventDto[]>(
    `/families/${familyId}/events?${query.toString()}`,
  );
  return events.map(mapEvent);
}

/** GET /families/:id/events/:eventId — для deep link и формы правки. */
export async function fetchFamilyEvent(
  familyId: string,
  eventId: string,
  year?: number | null,
): Promise<FamilyEvent> {
  const query = year ? `?year=${encodeURIComponent(String(year))}` : '';
  return mapEvent(
    await apiRequest<FamilyEventDto>(
      `/families/${familyId}/events/${eventId}${query}`,
    ),
  );
}

/** POST /families/:id/events — только owner/admin. */
export async function createFamilyEvent(
  familyId: string,
  payload: FamilyEventPayload,
): Promise<FamilyEvent> {
  return mapEvent(
    await apiRequest<FamilyEventDto>(`/families/${familyId}/events`, {
      method: 'POST',
      body: payload.clientRequestId
        ? { ...bodyOf(payload), clientRequestId: payload.clientRequestId }
        : bodyOf(payload),
    }),
  );
}

/** PATCH /families/:id/events/:eventId — только owner/admin. */
export async function updateFamilyEvent(
  familyId: string,
  eventId: string,
  payload: FamilyEventPayload,
): Promise<FamilyEvent> {
  return mapEvent(
    await apiRequest<FamilyEventDto>(
      `/families/${familyId}/events/${eventId}`,
      { method: 'PATCH', body: bodyOf(payload) },
    ),
  );
}

/**
 * POST /families/:id/events/:eventId/response — личный ответ зрителя.
 * Состав «Кто едет» не меняет.
 */
export function respondToFamilyEvent(
  familyId: string,
  eventId: string,
  response: FamilyEventResponse,
) {
  return apiRequest<FamilyEventResponseDto>(
    `/families/${familyId}/events/${eventId}/response`,
    { method: 'POST', body: { response } },
  );
}

/** DELETE /families/:id/events/:eventId — отмена события родителем. */
export function cancelFamilyEvent(familyId: string, eventId: string) {
  return apiRequest<void>(`/families/${familyId}/events/${eventId}`, {
    method: 'DELETE',
  });
}

/**
 * PUT /families/:id/events/:eventId/photo — обложка события. Только родитель.
 * Сервер отдаёт новую ссылку: прежняя обложка заменяется, а не дополняется.
 */
export async function uploadFamilyEventPhoto(
  familyId: string,
  eventId: string,
  photo: PickedPhoto,
) {
  const form = new FormData();
  await appendPhoto(form, 'photo', photo);
  return apiRequest<FamilyEventPhotoDto>(
    `/families/${familyId}/events/${eventId}/photo`,
    { method: 'PUT', body: form },
  );
}

/** DELETE /families/:id/events/:eventId/photo — убрать обложку. */
export function removeFamilyEventPhoto(familyId: string, eventId: string) {
  return apiRequest<void>(`/families/${familyId}/events/${eventId}/photo`, {
    method: 'DELETE',
  });
}

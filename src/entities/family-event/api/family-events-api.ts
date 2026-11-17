import { authorizedImage, apiRequest } from '@shared/api';
import type {
  FamilyEvent,
  FamilyEventPerson,
  FamilyEventResponse,
  FamilyEventRepeat,
} from '../model/family-event';

type FamilyEventPersonDto = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
};

type FamilyEventDto = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  repeat: FamilyEventRepeat;
  reminderLeadMinutes: number | null;
  participants: FamilyEventPersonDto[];
  viewer: {
    canEdit: boolean;
    response: FamilyEventResponse | null;
  };
};

export type FamilyEventPayload = {
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  repeat: FamilyEventRepeat;
  reminderLeadMinutes: number | null;
  participants: string[];
  /** Только для создания: retry после потерянного ответа не создаёт дубль. */
  clientRequestId?: string;
};

const toPerson = (person: FamilyEventPersonDto): FamilyEventPerson => ({
  id: person.userId,
  name: person.displayName,
  avatar: person.avatarUrl ? authorizedImage(person.avatarUrl) : null,
});

/** DTO сервера → модель экрана: даты становятся Date, ответ — личным. */
function toFamilyEvent(dto: FamilyEventDto): FamilyEvent {
  const startsAt = new Date(dto.startsAt);
  const endsAt = new Date(dto.endsAt);
  return {
    id: dto.id,
    kind: 'custom',
    title: dto.title,
    description: dto.description,
    startsAt,
    endsAt,
    repeat: dto.repeat,
    timezone: dto.timezone,
    participants: (dto.participants ?? []).map(toPerson),
    reminderLeadMinutes: dto.reminderLeadMinutes ?? undefined,
    reminderAt:
      dto.reminderLeadMinutes == null
        ? undefined
        : new Date(startsAt.getTime() - dto.reminderLeadMinutes * 60_000),
    response: dto.viewer?.response ?? undefined,
    canEdit: dto.viewer?.canEdit === true,
  };
}

const bodyOf = (payload: FamilyEventPayload) => ({
  title: payload.title,
  description: payload.description,
  startsAt: payload.startsAt.toISOString(),
  endsAt: payload.endsAt.toISOString(),
  timezone: payload.timezone,
  repeat: payload.repeat,
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
  return events.map(toFamilyEvent);
}

/** GET /families/:id/events/:eventId — для deep link и формы правки. */
export async function fetchFamilyEvent(
  familyId: string,
  eventId: string,
  year?: number | null,
): Promise<FamilyEvent> {
  const query = year ? `?year=${encodeURIComponent(String(year))}` : '';
  return toFamilyEvent(
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
  return toFamilyEvent(
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
  return toFamilyEvent(
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
  return apiRequest<{ response: FamilyEventResponse }>(
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

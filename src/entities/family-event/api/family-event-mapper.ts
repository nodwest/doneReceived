import type { FamilyEvent, FamilyEventPerson } from '../model/family-event';
import type { components } from './generated/calendar';

type FamilyEventDto = components['schemas']['FamilyEventDto'];
type FamilyEventPersonDto = components['schemas']['FamilyEventPersonDto'];

/** Картинка API: тест подставляет заглушку вместо authorizedImage. */
export type EventImageFactory = (
  url: string,
) => NonNullable<FamilyEventPerson['avatar']>;

const toPerson = (
  person: FamilyEventPersonDto,
  toImage: EventImageFactory,
): FamilyEventPerson => ({
  id: person.userId,
  name: person.displayName,
  avatar: person.avatarUrl ? toImage(person.avatarUrl) : null,
});

/**
 * DTO сервера → модель экрана: даты становятся Date, ответ — личным.
 *
 * Fallback'и (`kind`, `participants`, `viewer`) намеренно оставлены для
 * старого backend'а между релизами: generated-тип описывает текущий сервер,
 * но клиент не должен падать, если поле ещё не пришло.
 */
export function toFamilyEvent(
  dto: FamilyEventDto,
  toImage: EventImageFactory,
): FamilyEvent {
  const startsAt = new Date(dto.startsAt);
  const endsAt = new Date(dto.endsAt);
  return {
    id: dto.id,
    kind: dto.kind ?? 'event',
    title: dto.title,
    description: dto.description,
    startsAt,
    endsAt,
    repeat: dto.repeat,
    timezone: dto.timezone,
    participants: (dto.participants ?? []).map((person) =>
      toPerson(person, toImage),
    ),
    photo: dto.photoUrl ? toImage(dto.photoUrl) : undefined,
    audienceUserIds: dto.audienceUserIds,
    reminderLeadMinutes: dto.reminderLeadMinutes ?? undefined,
    reminderAt:
      dto.reminderLeadMinutes == null
        ? undefined
        : new Date(startsAt.getTime() - dto.reminderLeadMinutes * 60_000),
    response: dto.viewer?.response ?? undefined,
    canEdit: dto.viewer?.canEdit === true,
  };
}

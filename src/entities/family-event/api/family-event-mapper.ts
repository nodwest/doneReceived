import type { FamilyEvent, FamilyEventPerson } from '../model/family-event';
import type { components } from './generated/calendar';

type FamilyEventDto = components['schemas']['FamilyEventDto'];
type FamilyEventPersonDto = components['schemas']['FamilyEventPersonDto'];

/** Картинка API: тест подставляет заглушку вместо authorizedImage. */
export type EventImageFactory = (
  url: string,
) => NonNullable<FamilyEventPerson['avatar']>;

/**
 * Старые серверы могли использовать адрес сайта как основу ссылки на
 * приватную обложку. Сам запрос строим по каноническому пути API.
 */
function eventPhotoPath(url: string, eventId: string) {
  const uuid = '[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}';
  const route = new RegExp(
    `(/families/${uuid}/events/(${uuid})/photo/${uuid})(?:[?#].*)?$`,
    'i',
  );
  let pathname: string;
  try {
    pathname = new URL(url, 'https://relative.invalid').pathname;
  } catch {
    return url;
  }
  const match = route.exec(pathname);
  return match?.[2].toLowerCase() === eventId.toLowerCase() ? match[1] : url;
}

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
  const participants = new Map<string, FamilyEventPerson>();
  for (const person of dto.participants ?? []) {
    const previous = participants.get(person.userId);
    if (!previous || (!previous.avatar && person.avatarUrl)) {
      participants.set(person.userId, toPerson(person, toImage));
    }
  }
  const lead = dto.reminderLeadMinutes ?? 0;
  const savedDays = lead > 1440 ? Math.floor(lead / 1440) : undefined;
  return {
    id: dto.id,
    kind: dto.kind ?? 'event',
    title: dto.title,
    description: dto.description,
    startsAt,
    endsAt,
    repeat: dto.repeat,
    timezone: dto.timezone,
    participants: [...participants.values()],
    photo: dto.photoUrl
      ? toImage(eventPhotoPath(dto.photoUrl, dto.id))
      : undefined,
    audienceUserIds: dto.audienceUserIds,
    reminderLeadMinutes: dto.reminderLeadMinutes ?? undefined,
    reminderDailyDays: dto.reminderDailyDays ?? savedDays,
    reminderDailyMinute:
      dto.reminderDailyMinute ?? (savedDays === undefined ? undefined : 0),
    reminderAt:
      dto.reminderLeadMinutes == null
        ? undefined
        : new Date(startsAt.getTime() - dto.reminderLeadMinutes * 60_000),
    response: dto.viewer?.response ?? undefined,
    canEdit: dto.viewer?.canEdit === true,
  };
}

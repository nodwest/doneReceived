import type { ImageSourcePropType } from 'react-native';
import { addDays } from '@shared/lib';

/** Класс события: поездка, мероприятие или праздник. */
export type FamilyEventKind = 'trip' | 'event' | 'holiday';

/** Ключи i18n для классов события. */
export const FAMILY_EVENT_KIND_LABELS = {
  trip: 'calendar.kindTrip',
  event: 'calendar.kindEvent',
  holiday: 'calendar.kindHoliday',
} as const satisfies Record<FamilyEventKind, string>;

/** Разовое событие или ежегодная дата. */
export type FamilyEventRepeat = 'once' | 'annual';

/** Ответ участника: еду / не еду. Хранится на сервере. */
export type FamilyEventResponse = 'going' | 'not_going';

/** Человек в событии: участник, который едет. */
export interface FamilyEventPerson {
  id: string;
  name: string;
  /** Фото с сервера (уже с Bearer-токеном) или null — тогда буква. */
  avatar: ImageSourcePropType | null;
}

/**
 * Событие семейного календаря. Даты — Date в локальной зоне.
 * Приходят из GET /families/:familyId/events.
 */
export interface FamilyEvent {
  id: string;
  kind: FamilyEventKind;
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  repeat: FamilyEventRepeat;
  /** IANA-зона создателя: нужна для ежегодных дат и правки. */
  timezone: string;
  participants: FamilyEventPerson[];
  /** Фото обложки; без него используется иллюстрация категории. */
  photo?: ImageSourcePropType;
  /** Когда напомнить; null — напоминание не задано. */
  reminderAt?: Date;
  /** Сколько минут до начала напоминать — для формы и повторного редактирования. */
  reminderLeadMinutes?: number;
  audienceUserIds?: string[] | null;
  /** Ответ текущего пользователя. */
  response?: FamilyEventResponse;
  /** Родитель этой семьи может редактировать событие. */
  canEdit: boolean;
  /** Главное событие недели: показывается большой карточкой. */
  featured?: boolean;
}

/** A calendar day is a half-open interval in local time. */
export function eventCoversDay(event: FamilyEvent, day: Date) {
  return (
    event.startsAt < addDays(day, 1) &&
    (event.endsAt > day || event.startsAt.getTime() === day.getTime())
  );
}

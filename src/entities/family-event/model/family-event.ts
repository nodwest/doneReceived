import type { ImageSourcePropType } from 'react-native';

/** Тип события: иконка, тон и способ показа в календаре зависят от него. */
export type FamilyEventKind =
  | 'trip'
  | 'cinema'
  | 'doctor'
  | 'meeting'
  | 'homework'
  | 'custom';

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
 * Приходят из GET /families/:familyId/events; фото пока нет.
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
  /** Фото обложки; без него карточка рисует синий градиент. */
  photo?: ImageSourcePropType;
  /** Когда напомнить; null — напоминание не задано. */
  reminderAt?: Date;
  /** Сколько минут до начала напоминать — для формы и повторного редактирования. */
  reminderLeadMinutes?: number;
  /** Ответ текущего пользователя. */
  response?: FamilyEventResponse;
  /** Родитель этой семьи может редактировать событие. */
  canEdit: boolean;
  /** Главное событие недели: показывается большой карточкой. */
  featured?: boolean;
}

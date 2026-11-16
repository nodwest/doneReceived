import type { ImageSourcePropType } from 'react-native';

/** Тип события: иконка, тон и способ показа в календаре зависят от него. */
export type FamilyEventKind =
  | 'trip'
  | 'cinema'
  | 'doctor'
  | 'meeting'
  | 'homework';

/** Человек в событии: участник или тот, кто остаётся дома. */
export interface FamilyEventPerson {
  id: string;
  name: string;
  /** Фото с сервера (уже с Bearer-токеном) или null — тогда буква. */
  avatar: ImageSourcePropType | null;
}

/**
 * Событие семейного календаря. Даты — Date в локальной зоне.
 * Серверный слой появится отдельно: сейчас модель не знает про HTTP.
 */
export interface FamilyEvent {
  id: string;
  kind: FamilyEventKind;
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  participants: FamilyEventPerson[];
  /** Фото обложки; без него карточка рисует синий градиент. */
  photo?: ImageSourcePropType;
  /** Когда напомнить; null — напоминание не задано. */
  reminderAt?: Date;
  /** Главное событие недели: показывается большой карточкой. */
  featured?: boolean;
}

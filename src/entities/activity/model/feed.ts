import type { ImageSourcePropType } from 'react-native';

/** Что случилось: тип события в ленте с сервера (GET /families/:id/activity). */
export type FeedEventType =
  | 'task_created'
  | 'task_submitted'
  | 'task_withdrawn'
  | 'task_approved'
  | 'task_rejected'
  /** Отказ без переделки: сервер шлёт task_rejected, различаем по missed-tasks. */
  | 'task_closed'
  | 'task_cancelled'
  | 'task_expired'
  | 'wish_added'
  | 'deposit'
  | 'event_created'
  | 'event_updated'
  | 'event_cancelled';

/** Человек в событии: имя и фото (null — буква имени). */
export interface FeedPerson {
  name: string;
  avatar: ImageSourcePropType | null;
}

/** Событие ленты на главной, с именами вместо id. */
export interface FeedEvent {
  id: string;
  type: FeedEventType;
  /** ISO-время события. */
  at: string;
  /**
   * Назначение задания: по нему события одного задания собираются в одну
   * карточку. null — событие не о задании (желание, пополнение, календарь).
   */
  assignmentId: string | null;
  /** Название задания или желания на момент события. */
  title: string | null;
  /** Сумма события (награда, пополнение); null — без суммы. */
  points: number | null;
  /** Ребёнок, о чьём задании или желании событие; null — пополнение. */
  child: FeedPerson | null;
  /** Кто это сделал. */
  actor: FeedPerson;
  /** Сделал сам смотрящий («You»). */
  byMe: boolean;
}

/**
 * Кто смотрит ленту: семья и аккаунт. Ребёнку сервер отдаёт только события
 * его профиля, а список детей ему закрыт — его имя берём из сессии.
 */
export interface FeedViewer {
  familyId: string;
  userId: string;
  child?: { id: string; name: string; avatarUrl: string | null };
}

/** Одна карточка ленты: все события одного задания, новые первыми. */
export interface FeedCard {
  /** assignmentId у задания, id события у остальных карточек. */
  key: string;
  events: FeedEvent[];
}

/**
 * Сложить события в карточки: у задания одна карточка со всей историей
 * статусов, остальные события — по одной карточке. Порядок — по времени
 * последнего события, поэтому карточка задания поднимается наверх после
 * каждого изменения. События в карточке — новые первыми, как пришли с сервера.
 */
export function groupFeed(events: FeedEvent[]): FeedCard[] {
  const cards = new Map<string, FeedCard>();
  for (const event of events) {
    const key = event.assignmentId
      ? `task:${event.assignmentId}`
      : `event:${event.id}`;
    const card = cards.get(key);
    if (card) card.events.push(event);
    else cards.set(key, { key, events: [event] });
  }
  return [...cards.values()];
}

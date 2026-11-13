import type { ImageSourcePropType } from 'react-native';

/** Что случилось: тип события в ленте с сервера (GET /families/:id/activity). */
export type FeedEventType =
  | 'task_created'
  | 'task_submitted'
  | 'task_withdrawn'
  | 'task_approved'
  | 'task_rejected'
  | 'task_cancelled'
  | 'wish_added'
  | 'deposit';

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

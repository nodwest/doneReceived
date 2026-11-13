import type { RejectReasonKey } from '@entities/task';

export type { RejectReasonKey };

/** Причины отказа по порядку; подписи — reviewTask.reasons.*. */
export const rejectReasons: readonly RejectReasonKey[] = [
  'not-done-properly',
  'not-finished',
  'other',
];

export type RejectDecision = {
  reason: RejectReasonKey;
  /** Комментарий родителя; пустая строка — без комментария. */
  comment: string;
  /** На переделку (награда в резерве) или закрыть (награда вернётся). */
  retry: boolean;
};

/** Сколько символов в комментарии к отказу (как на сервере). */
export const REJECT_COMMENT_MAX_LENGTH = 300;

/** Комментарий обязателен только у причины Other. */
export const isCommentRequired = (reason: RejectReasonKey) =>
  reason === 'other';

/** Срок задания прошёл: переделать уже нельзя, только закрыть. */
export const isDeadlinePassed = (expiresAt: string | null, now = Date.now()) =>
  expiresAt !== null && new Date(expiresAt).getTime() <= now;

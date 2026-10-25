export type RejectReasonKey = 'not-done-properly' | 'not-finished' | 'other';

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
};

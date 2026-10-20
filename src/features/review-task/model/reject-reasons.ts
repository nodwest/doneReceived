export type RejectReasonKey = 'not-done-properly' | 'not-finished' | 'other';

export const rejectReasons: readonly { key: RejectReasonKey; label: string }[] =
  [
    { key: 'not-done-properly', label: 'Not done properly' },
    { key: 'not-finished', label: 'Not finished' },
    { key: 'other', label: 'Other' },
  ];

export type RejectDecision = {
  reason: RejectReasonKey;
  /** Комментарий родителя; пустая строка — без комментария. */
  comment: string;
};

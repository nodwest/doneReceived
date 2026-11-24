import type { FeedEvent } from './feed';

/** Причина отказа; у «Other» своей подписи нет — всё в комментарии. */
export type StepReason = 'not-done-properly' | 'not-finished';

/** Комментарий к шагу истории: ребёнка к сдаче или родителя к отказу. */
export interface StepComment {
  /** Только у отказа. */
  reason: StepReason | null;
  /** Пусто, если родитель выбрал причину и ничего не написал. */
  text: string;
}

/** Отчёт ребёнка и решение по нему: откуда берутся комментарии. */
export interface SubmissionComments {
  submittedAt: string;
  note: string;
  /** Отказ родителя; null — принято или ещё не проверено. */
  rejection: { at: string; comment: StepComment } | null;
}

/**
 * У событий ленты нет id отчёта: комментарий находит свой шаг по времени.
 * Событие и отчёт сервер пишет вместе, минуты хватает с запасом.
 */
const MATCH_MS = 60_000;

const SUBMITTED = new Set(['task_submitted']);
const REJECTED = new Set(['task_rejected', 'task_closed']);

/** Есть ли в истории шаги, к которым бывают комментарии. */
export const canHaveComments = (events: readonly FeedEvent[]) =>
  events.some((event) => SUBMITTED.has(event.type) || REJECTED.has(event.type));

/**
 * Комментарии по id события. Отозванные отчёты сервер не отдаёт — у их шагов
 * комментария нет.
 */
export function matchStepComments(
  events: readonly FeedEvent[],
  submissions: readonly SubmissionComments[],
): Map<string, StepComment> {
  const comments = new Map<string, StepComment>();
  const attach = (types: Set<string>, at: string, comment: StepComment) => {
    const time = new Date(at).getTime();
    let nearest: FeedEvent | null = null;
    let nearestGap = MATCH_MS;
    for (const event of events) {
      if (!types.has(event.type) || comments.has(event.id)) continue;
      const gap = Math.abs(new Date(event.at).getTime() - time);
      if (gap <= nearestGap) {
        nearest = event;
        nearestGap = gap;
      }
    }
    if (nearest) comments.set(nearest.id, comment);
  };
  for (const { submittedAt, note, rejection } of submissions) {
    if (note) attach(SUBMITTED, submittedAt, { reason: null, text: note });
    if (rejection) attach(REJECTED, rejection.at, rejection.comment);
  }
  return comments;
}

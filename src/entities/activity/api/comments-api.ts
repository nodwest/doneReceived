import { apiRequest } from '@shared/api';
import type { StepReason, SubmissionComments } from '../model/step-comment';

type SubmissionDto = {
  submission: { submittedAt: string; note: string | null };
  /** null — ещё не проверено. */
  review: {
    decision: 'approved' | 'rejected';
    reasonCode: string | null;
    comment: string | null;
    reviewedAt: string;
  } | null;
};

const REASONS: Partial<Record<string, StepReason>> = {
  not_done_properly: 'not-done-properly',
  not_finished: 'not-finished',
};

/**
 * GET /families/:id/task-assignments/:assignmentId/submissions — отчёты по
 * заданию с решениями: комментарии ребёнка и родителя. Отозванных нет.
 */
export async function fetchSubmissionComments(
  familyId: string,
  assignmentId: string,
  signal: AbortSignal,
): Promise<SubmissionComments[]> {
  const items = await apiRequest<SubmissionDto[]>(
    `/families/${familyId}/task-assignments/${assignmentId}/submissions`,
    { signal },
  );
  return items.map(({ submission, review }) => {
    const rejected = review?.decision === 'rejected' ? review : null;
    const reason = REASONS[rejected?.reasonCode ?? ''] ?? null;
    const text = rejected?.comment?.trim() ?? '';
    return {
      submittedAt: submission.submittedAt,
      note: submission.note?.trim() ?? '',
      rejection:
        rejected && (reason || text)
          ? { at: rejected.reviewedAt, comment: { reason, text } }
          : null,
    };
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { operationKeys } from '@entities/operation';
import { approveTask, rejectTask, taskKeys, type Task } from '@entities/task';
import { walletKeys } from '@entities/wallet';
import { isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import type { RejectDecision } from './reject-reasons';

/** Ключ ошибки проверки: `reviewTask.errors.*`. */
function reviewError(error: unknown) {
  if (!isApiError(error)) return 'failed' as const;
  if (error.status === 0) return 'network' as const;
  const code =
    error.data && typeof error.data === 'object'
      ? (error.data as { code?: unknown }).code
      : null;
  if (code === 'SUBMISSION_WITHDRAWN') return 'withdrawn' as const;
  if (code === 'TASK_DEADLINE_PASSED') return 'deadlinePassed' as const;
  if (error.status === 409) return 'alreadyReviewed' as const;
  return 'failed' as const;
}

/**
 * Проверка задания родителем. Approve: задание выполнено (done) и уходит из
 * списков, награда из резерва уходит ребёнку. Reject: на переделку —
 * задание снова активно с причиной, награда остаётся в резерве; закрыть —
 * задание уходит из списков, резерв возвращается родителю. Кэш задач, истории и кошельков
 * перечитывается и после ошибки — карточка могла устареть.
 */
export function useReviewTask() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;
  const refresh = () =>
    Promise.all(
      [taskKeys.all, operationKeys.all, walletKeys.all].map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );
  const onError = (error: unknown) => {
    showToast(t(`reviewTask.errors.${reviewError(error)}`));
    return refresh();
  };

  const approve = useMutation({
    mutationFn: (task: Task) => approveTask(task, familyId),
    onSuccess: (_, task) => {
      showToast(
        t('tasks.approvedToast', {
          amount: `$${task.reward}`,
          name: task.assignee.name,
        }),
      );
      return refresh();
    },
    onError,
  });

  const reject = useMutation({
    mutationFn: ({
      task,
      decision,
    }: {
      task: Task;
      decision: RejectDecision;
    }) =>
      rejectTask(
        {
          id: task.id,
          submissionId: task.submissionId,
          ...decision,
          comment: decision.comment.trim(),
        },
        familyId,
      ),
    onSuccess: (_, { task, decision }) => {
      showToast(
        t(decision.retry ? 'tasks.rejectedToast' : 'tasks.closedToast', {
          name: task.assignee.name,
        }),
      );
      return refresh();
    },
    onError,
  });

  return {
    approve: approve.mutate,
    reject: (task: Task, decision: RejectDecision) =>
      reject.mutate({ task, decision }),
    isPending: approve.isPending || reject.isPending,
  };
}

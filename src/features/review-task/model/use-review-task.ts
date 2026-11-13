import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { addReward, operationKeys } from '@entities/operation';
import { approveTask, rejectTask, taskKeys, type Task } from '@entities/task';
import { payReward, walletKeys } from '@entities/wallet';
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
  if (error.status === 409) return 'alreadyReviewed' as const;
  return 'failed' as const;
}

/**
 * Проверка задания родителем. Approve: задание выполнено (done) и уходит из
 * списков. У задания с сервера награда из резерва уходит ребёнку на сервере;
 * у мокового награда записывается в моковую историю (`addReward`) и деньги
 * уходят из мокового кошелька (`payReward`). Reject: моковое снова активно с
 * причиной; с сервера пока закрывается, резерв возвращается родителю
 * (переделку сервер ещё не умеет). Кэш задач, истории и кошельков
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
    mutationFn: async (task: Task) => {
      await approveTask(task, familyId);
      if (task.serverTaskId) return;
      // Моковая история и кошелёк: у моковых детей есть фото.
      const { assignee } = task;
      if (!assignee.avatar) return;
      const reward = await addReward({
        title: task.title,
        description: task.description,
        amount: task.reward,
        child: {
          id: assignee.id,
          name: assignee.name,
          avatar: assignee.avatar,
        },
        doneAt: task.doneAt,
        photo: task.photo,
        note: task.note,
      });
      await payReward({
        amount: reward.amount,
        at: reward.at,
        child: reward.child,
        task: reward.title,
        operationId: reward.id,
        taskDoneAt: reward.doneAt,
      });
    },
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
    }) => {
      // Серверу причина нужна словами: подпись причины и комментарий.
      const label = t(`reviewTask.reasons.${decision.reason}`);
      const comment = decision.comment.trim();
      return rejectTask(
        {
          id: task.id,
          serverTaskId: task.serverTaskId,
          submissionId: task.submissionId,
          ...decision,
          reasonText: comment ? `${label}. ${comment}` : label,
        },
        familyId,
      );
    },
    onSuccess: (_, { task }) => {
      showToast(
        t(task.serverTaskId ? 'tasks.closedToast' : 'tasks.rejectedToast', {
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

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addReward, operationKeys } from '@entities/operation';
import { approveTask, rejectTask, taskKeys, type Task } from '@entities/task';
import { payReward, walletKeys } from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import type { RejectDecision } from './reject-reasons';

/**
 * Проверка задания родителем. Approve: задание выполнено (done) и уходит из
 * списков, награда записывается в историю (Rewards history), деньги уходят
 * из кошелька родителя на баланс ребёнка (транзакции, Wallet). Reject:
 * задание снова активно, ребёнок видит причину. Пока бэкенда нет, шаги идут
 * по очереди в моки; с API это будут два запроса — approve и reject.
 */
export function useReviewTask() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const refresh = () =>
    Promise.all(
      [taskKeys.all, operationKeys.all, walletKeys.all].map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    );

  const approve = useMutation({
    mutationFn: async (task: Task) => {
      // Проверка пока только у моковых заданий: у их детей есть фото.
      const { assignee } = task;
      if (!assignee.avatar) throw new Error('Approve is mock-only for now');
      await approveTask(task.id);
      const reward = await addReward({
        title: task.title,
        description: task.description,
        amount: task.reward,
        child: {
          id: Number(assignee.id),
          name: assignee.name,
          avatar: assignee.avatar,
        },
        doneAt: task.doneAt,
        photo: task.photo,
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
  });

  const reject = useMutation({
    mutationFn: ({
      task,
      decision,
    }: {
      task: Task;
      decision: RejectDecision;
    }) => rejectTask({ id: task.id, ...decision }),
    onSuccess: (_, { task }) => {
      showToast(t('tasks.rejectedToast', { name: task.assignee.name }));
      return refresh();
    },
  });

  return {
    approve: approve.mutate,
    reject: (task: Task, decision: RejectDecision) =>
      reject.mutate({ task, decision }),
    isPending: approve.isPending || reject.isPending,
  };
}

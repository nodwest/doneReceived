import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelTask, taskKeys, type Task } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';

/** Родитель отменяет задание: оно пропадает из списков без награды. */
export function useCancelTask() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: Task) => cancelTask(task.id),
    onSuccess: () => {
      showToast(t('tasks.cancelledToast'));
      return queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

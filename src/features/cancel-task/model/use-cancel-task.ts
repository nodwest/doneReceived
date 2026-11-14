import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { cancelTask, type Task } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { syncData } from '@shared/api';

/**
 * Родитель отменяет задание: оно пропадает из списков без награды. С
 * сервера — резерв возвращается в кошелёк, его тоже перечитываем.
 */
export function useCancelTask() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;
  return useMutation({
    mutationFn: (task: Task) => cancelTask(task, familyId),
    onSuccess: () => {
      showToast(t('tasks.cancelledToast'));
      return syncData(queryClient, 'task-cancelled');
    },
    onError: () => showToast(t('tasks.cancelFailed')),
  });
}

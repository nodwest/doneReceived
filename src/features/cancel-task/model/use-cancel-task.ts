import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import { cancelTask, taskKeys, type Task } from '@entities/task';
import { walletKeys } from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';

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
      return Promise.all(
        [taskKeys.all, walletKeys.all].map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: () => showToast(t('tasks.cancelFailed')),
  });
}

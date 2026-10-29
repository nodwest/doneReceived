import type { Task } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { useSetTaskStatus } from './use-set-task-status';

/**
 * Действия ребёнка с заданием: I did it! отправляет его на проверку,
 * «Переделать» возвращает в активные. Тосты пока заглушки.
 */
export function useTaskActions() {
  const { t } = useTranslation();
  const { mutate, isPending } = useSetTaskStatus();

  const markDone = (task: Task) =>
    mutate(
      { id: task.id, status: 'review' },
      { onSuccess: () => showToast(t('completeTask.sentToast')) },
    );

  const redo = (task: Task) =>
    mutate(
      { id: task.id, status: 'active' },
      { onSuccess: () => showToast(t('completeTask.redoToast')) },
    );

  return { markDone, redo, isPending };
}

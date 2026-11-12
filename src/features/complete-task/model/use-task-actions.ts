import type { ChecklistItem, Task } from '@entities/task';
import { isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { useSetTaskStatus } from './use-set-task-status';
import { useTickChecklistItem } from './use-tick-checklist-item';

/** Ключ ошибки: `completeTask.errors.*`. */
function actionError(error: unknown) {
  if (!isApiError(error)) return 'failed' as const;
  if (error.status === 0) return 'network' as const;
  const code =
    error.data && typeof error.data === 'object'
      ? (error.data as { code?: unknown }).code
      : null;
  if (code === 'SUBMISSION_ALREADY_REVIEWED') return 'alreadyReviewed' as const;
  if (code === 'TASK_DEADLINE_PASSED') return 'deadlinePassed' as const;
  if (code === 'TASK_CANCELLED') return 'cancelled' as const;
  if (code === 'ASSIGNMENT_NOT_ACTIVE') return 'notActive' as const;
  return 'failed' as const;
}

/**
 * Действия ребёнка с заданием: I did it! отправляет его на проверку, Redo
 * забирает непроверенный отчёт — задание снова активно, toggleStep отмечает
 * шаг чеклиста или снимает отметку.
 */
export function useTaskActions() {
  const { t } = useTranslation();
  const { mutate, isPending } = useSetTaskStatus();
  const { mutate: tick } = useTickChecklistItem();
  const onError = (error: unknown) =>
    showToast(t(`completeTask.errors.${actionError(error)}`));

  const markDone = (task: Task) =>
    mutate(
      { id: task.id, serverTaskId: task.serverTaskId, status: 'review' },
      { onSuccess: () => showToast(t('completeTask.sentToast')), onError },
    );

  const redo = (task: Task) =>
    mutate(
      { id: task.id, serverTaskId: task.serverTaskId, status: 'active' },
      { onSuccess: () => showToast(t('completeTask.redoToast')), onError },
    );

  const toggleStep = (task: Task, item: ChecklistItem) =>
    tick(
      {
        id: task.id,
        serverTaskId: task.serverTaskId,
        itemId: item.id,
        done: !item.done,
      },
      { onError },
    );

  return { markDone, redo, toggleStep, isPending };
}

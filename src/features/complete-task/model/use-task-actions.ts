import type { ChecklistItem, Task } from '@entities/task';
import { isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { photoUploadError, showToast } from '@shared/lib';
import { useNoteDraftStore } from './note-draft-store';
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
  // 10 попыток сдачи на задание (отозванные тоже считаются).
  if (code === 'SUBMISSION_LIMIT_REACHED') return 'tooManyAttempts' as const;
  return 'failed' as const;
}

/**
 * Действия ребёнка с заданием: I did it! отправляет его на проверку вместе с
 * черновиком комментария, Redo забирает непроверенный отчёт — задание снова
 * активно, а отправленный комментарий возвращается в поле; toggleStep
 * отмечает шаг чеклиста или снимает отметку.
 */
export function useTaskActions() {
  const { t } = useTranslation();
  const { mutate, isPending } = useSetTaskStatus();
  const { mutate: tick } = useTickChecklistItem();
  const onError = (error: unknown) =>
    showToast(
      // Фото не приняли (велико или сервер занят) — фото-ошибкой.
      isApiError(error) && (error.status === 413 || error.status === 503)
        ? t(`photos.${photoUploadError(error)}`)
        : t(`completeTask.errors.${actionError(error)}`),
    );

  const { setDraft, clearDraft } = useNoteDraftStore.getState();

  const markDone = (task: Task) => {
    const draft = useNoteDraftStore.getState();
    const note = draft.drafts[task.id]?.trim();
    const photos = draft.photos[task.id] ?? [];
    mutate(
      {
        id: task.id,
        serverTaskId: task.serverTaskId,
        status: 'review',
        ...(note ? { note } : {}),
        ...(photos.length > 0 ? { photos } : {}),
      },
      {
        onSuccess: () => {
          clearDraft(task.id);
          showToast(t('completeTask.sentToast'));
        },
        onError,
      },
    );
  };

  const redo = (task: Task) =>
    mutate(
      {
        id: task.id,
        serverTaskId: task.serverTaskId,
        submissionId: task.submissionId,
        status: 'active',
      },
      {
        onSuccess: () => {
          // Отчёт отозван, а комментарий не пропадает: снова в поле.
          if (task.note) setDraft(task.id, task.note);
          showToast(t('completeTask.redoToast'));
        },
        onError,
      },
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

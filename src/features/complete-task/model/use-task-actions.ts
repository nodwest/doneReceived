import { useQueryClient } from '@tanstack/react-query';
import {
  taskKeys,
  type ChecklistItem,
  type Task,
  type TaskStatusPayload,
} from '@entities/task';
import { apiErrorCode, isApiError, syncData } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { photoUploadError, showToast } from '@shared/lib';
import { useNoteDraftStore } from './note-draft-store';
import { isAmbiguousTaskError, useSetTaskStatus } from './use-set-task-status';
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
  if (code === 'SUBMISSION_NOT_PENDING') return 'notPending' as const;
  if (code === 'SUBMISSION_REQUEST_MISMATCH') return 'requestMismatch' as const;
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
export function useTaskActions(taskId?: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutateAsync } = useSetTaskStatus();
  const { mutate: tick } = useTickChecklistItem();
  const isPending = useNoteDraftStore(
    (state) => taskId !== undefined && !!state.actions[taskId],
  );
  const onError = (error: unknown) =>
    showToast(
      isApiError(error) &&
        ([413, 429, 503].includes(error.status) ||
          apiErrorCode(error) === 'TASK_PHOTO_QUOTA_REACHED')
        ? t(`photos.${photoUploadError(error)}`)
        : t(`completeTask.errors.${actionError(error)}`),
    );

  const run = async (task: Task, status: TaskStatusPayload['status']) => {
    const { id } = task;
    const store = useNoteDraftStore;
    const state = store.getState();
    if (state.actions[id]) return;
    if (status === 'active' && !task.submissionId) {
      showToast(t('completeTask.errors.notPending'));
      await syncData(queryClient, 'task-withdrawn');
      return;
    }
    const signalOwner = new AbortController();
    store.setState({ actions: { ...state.actions, [id]: signalOwner } });

    const note = state.drafts[id]?.trim() || undefined;
    const photos = state.photos[id];
    const submission =
      status === 'review'
        ? (state.submissions[id] ?? {
            key: `submission-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            note,
            photos,
          })
        : undefined;
    if (submission) {
      store.setState({
        submissions: { ...state.submissions, [id]: submission },
      });
    }

    const forgetSubmission = () =>
      store.setState(({ submissions }) => {
        const remaining = { ...submissions };
        delete remaining[id];
        return { submissions: remaining };
      });

    try {
      const result = await mutateAsync({
        payload: {
          id,
          status,
          submissionId: task.submissionId,
          clientRequestId: submission?.key,
          note: submission?.note,
          photos: submission?.photos,
        },
        signal: signalOwner.signal,
      });
      if (signalOwner.signal.aborted) return;
      const current = store.getState();
      forgetSubmission();
      if (submission) {
        if (
          (current.drafts[id]?.trim() || undefined) === submission.note &&
          current.photos[id] === submission.photos
        )
          current.clearDraft(id);
        showToast(t('completeTask.sentToast'));
      } else {
        const active = queryClient
          .getQueryCache()
          .findAll({ queryKey: taskKeys.all, type: 'active' })
          .some(
            ({ state }) =>
              state.status === 'success' &&
              Array.isArray(state.data) &&
              (state.data as Task[]).some(
                (latest) => latest.id === id && latest.status === 'active',
              ),
          );
        if (
          active &&
          result?.note &&
          current.drafts[id] === state.drafts[id] &&
          !current.drafts[id]
        )
          current.setDraft(id, result.note);
        showToast(t('completeTask.redoToast'));
      }
    } catch (error) {
      if (signalOwner.signal.aborted) return;
      if (isAmbiguousTaskError(error)) {
        showToast(t('completeTask.errors.unconfirmed'));
      } else {
        if (submission) forgetSubmission();
        onError(error);
      }
    } finally {
      store.setState(({ actions }) => {
        if (actions[id] !== signalOwner) return {};
        const remaining = { ...actions };
        delete remaining[id];
        return { actions: remaining };
      });
    }
  };

  const markDone = (task: Task) => void run(task, 'review');
  const redo = (task: Task) => void run(task, 'active');

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

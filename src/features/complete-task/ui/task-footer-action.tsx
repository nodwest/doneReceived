import type { Task } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { CardButton } from '@shared/ui';
import { useTaskActions } from '../model/use-task-actions';

/**
 * Кнопка внизу карточки ребёнка: у активного задания — I did it!
 * (на проверку), у задания на проверке — Redo task (снова активное).
 */
export function TaskFooterAction({ task }: { task: Task }) {
  const { t } = useTranslation();
  const { markDone, redo, isPending } = useTaskActions();

  return task.status === 'review' ? (
    <CardButton
      label={t('completeTask.redo')}
      variant="review-outline"
      icon="refresh"
      loading={isPending}
      onPress={() => redo(task)}
    />
  ) : (
    <CardButton
      label={t('completeTask.done')}
      variant="child"
      icon="check"
      loading={isPending}
      onPress={() => markDone(task)}
    />
  );
}

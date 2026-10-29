import type { Task } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { PillButton } from '@shared/ui';
import { useTaskActions } from '../model/use-task-actions';

/**
 * Кнопка в футере карточки ребёнка: у активного задания — I did it!
 * (на проверку), у задания на проверке — «Переделать» (снова активное).
 */
export function TaskFooterAction({ task }: { task: Task }) {
  const { t } = useTranslation();
  const { markDone, redo, isPending } = useTaskActions();

  return task.status === 'review' ? (
    <PillButton
      label={t('completeTask.redo')}
      variant="outline"
      disabled={isPending}
      onPress={() => redo(task)}
    />
  ) : (
    <PillButton
      label={t('completeTask.done')}
      variant="child"
      disabled={isPending}
      onPress={() => markDone(task)}
    />
  );
}

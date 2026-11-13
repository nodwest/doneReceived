import type { Task } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { CardButton } from '@shared/ui';
import { useTaskActions } from '../model/use-task-actions';

/** Голубая кнопка I did it! в плитке задания (главная, список «To do»). */
export function DoneButton({ task }: { task: Task }) {
  const { t } = useTranslation();
  const { markDone, isPending } = useTaskActions();

  return (
    <CardButton
      label={t('completeTask.done')}
      variant="child"
      icon="check"
      size="md"
      fit
      disabled={isPending}
      onPress={() => markDone(task)}
    />
  );
}

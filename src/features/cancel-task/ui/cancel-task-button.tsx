import { useState } from 'react';
import type { Task } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { CardButton } from '@shared/ui';
import { useCancelTask } from '../model/use-cancel-task';
import { CancelTaskSheet } from './cancel-task-sheet';

/**
 * Cancel task внизу карточки активного задания у родителя: сначала шторка
 * подтверждения, отменённое задание не вернуть.
 */
export function CancelTaskButton({ task }: { task: Task }) {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const { mutate, isPending } = useCancelTask();
  return (
    <>
      <CardButton
        label={t('tasks.cancelTask')}
        variant="outline"
        disabled={isPending}
        onPress={() => setConfirming(true)}
      />
      <CancelTaskSheet
        visible={confirming}
        title={task.title}
        childName={task.assignee.name}
        onKeep={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          mutate(task);
        }}
      />
    </>
  );
}

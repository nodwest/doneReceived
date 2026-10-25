import { Redirect, useLocalSearchParams } from 'expo-router';
import { useTasks } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { TaskFormScreen } from './task-form-screen';

export function EditTaskPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: tasks, isPending } = useTasks();

  // Список ещё грузится (экран открыт по ссылке): ждём, а не уводим на /tasks.
  if (isPending) return null;

  const task = tasks?.find((item) => item.id === Number(id));
  if (!task) return <Redirect href="/tasks" />;

  return (
    <TaskFormScreen
      title={t('createTask.editTitle')}
      successMessage={t('createTask.updatedToast')}
      task={{
        id: task.id,
        title: task.title,
        reward: task.reward,
        description: task.description,
        expiresAt: task.expiresAt,
        assigneeId: task.assignee.id,
      }}
    />
  );
}

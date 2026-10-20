import { Redirect, useLocalSearchParams } from 'expo-router';
import { useTasks } from '@entities/task';
import { TaskFormScreen } from './task-form-screen';

export function EditTaskPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: tasks, isPending } = useTasks();

  // Список ещё грузится (экран открыт по ссылке): ждём, а не уводим на /tasks.
  if (isPending) return null;

  const task = tasks?.find((item) => item.id === Number(id));
  if (!task) return <Redirect href="/tasks" />;

  return (
    <TaskFormScreen
      title="Edit Task"
      successMessage="Task updated"
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

import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchTasks } from './tasks-api';

/** Ключи кэша задач: мутации инвалидируют taskKeys.all. */
export const taskKeys = {
  all: ['tasks'] as const,
  list: () => [...taskKeys.all, 'list'] as const,
};

export const tasksQueryOptions = () =>
  queryOptions({ queryKey: taskKeys.list(), queryFn: fetchTasks });

/** Все задачи родителя. */
export function useTasks() {
  return useQuery(tasksQueryOptions());
}

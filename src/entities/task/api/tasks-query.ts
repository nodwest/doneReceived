import { queryOptions, useQuery } from '@tanstack/react-query';
import { sortTasksByUrgency } from '../model/sort-tasks';
import { fetchTasks } from './tasks-api';

/** Ключи кэша задач: мутации инвалидируют taskKeys.all. */
export const taskKeys = {
  all: ['tasks'] as const,
  list: () => [...taskKeys.all, 'list'] as const,
};

export const tasksQueryOptions = () =>
  queryOptions({ queryKey: taskKeys.list(), queryFn: fetchTasks });

/** Все задачи родителя, отсортированные по срочности. */
export function useTasks() {
  // select со стабильной функцией: список пересортировывается только при новых данных.
  return useQuery({ ...tasksQueryOptions(), select: sortTasksByUrgency });
}

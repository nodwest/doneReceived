import { useQuery } from '@tanstack/react-query';
import { sortTasksByUrgency } from '../model/sort-tasks';
import type { TaskViewer } from './server-tasks-api';
import { fetchTasks } from './tasks-api';

/** Ключи кэша задач: мутации инвалидируют taskKeys.all. */
export const taskKeys = {
  all: ['tasks'] as const,
  list: (familyId: string | null) =>
    [...taskKeys.all, 'list', familyId] as const,
};

/**
 * Все задачи, отсортированные по срочности: моковые и, если передан `viewer`
 * (семья и кто смотрит), задания с сервера.
 */
export function useTasks(viewer: TaskViewer | null) {
  return useQuery({
    queryKey: taskKeys.list(viewer?.familyId ?? null),
    queryFn: () => fetchTasks(viewer),
    // select со стабильной функцией: список пересортировывается только при новых данных.
    select: sortTasksByUrgency,
  });
}

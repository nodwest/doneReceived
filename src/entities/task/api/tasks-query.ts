import { useQuery } from '@tanstack/react-query';
import { sortTasksByUrgency } from '../model/sort-tasks';
import type { TaskViewer } from './server-tasks-api';
import { fetchTasks } from './tasks-api';
import { queryRoots, SYNC_POLL_MS } from '@shared/api';

/** Ключи кэша задач: мутации инвалидируют taskKeys.all. */
export const taskKeys = {
  all: queryRoots.tasks,
  list: (familyId: string | null) =>
    [...taskKeys.all, 'list', familyId] as const,
};

/**
 * Все задачи, отсортированные по срочности: моковые и, если передан `viewer`
 * (семья и кто смотрит), задания с сервера — их список перечитывается раз в
 * SYNC_POLL_MS, пока приложение на экране.
 */
export function useTasks(viewer: TaskViewer | null) {
  return useQuery({
    queryKey: taskKeys.list(viewer?.familyId ?? null),
    queryFn: () => fetchTasks(viewer),
    // Задания меняет и другой человек (ребёнок сдал или отозвал отчёт).
    refetchInterval: viewer ? SYNC_POLL_MS : false,
    // select со стабильной функцией: список пересортировывается только при новых данных.
    select: sortTasksByUrgency,
  });
}

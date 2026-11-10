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
 * Как часто перечитывать задания с сервера, пока экран открыт: их меняет и
 * другой человек (ребёнок сдал или отозвал отчёт), а пушей пока нет.
 */
const SERVER_REFRESH_MS = 15_000;

/**
 * Все задачи, отсортированные по срочности: моковые и, если передан `viewer`
 * (семья и кто смотрит), задания с сервера — их список перечитывается раз в
 * 15 секунд, пока приложение на экране.
 */
export function useTasks(viewer: TaskViewer | null) {
  return useQuery({
    queryKey: taskKeys.list(viewer?.familyId ?? null),
    queryFn: () => fetchTasks(viewer),
    refetchInterval: viewer ? SERVER_REFRESH_MS : false,
    // select со стабильной функцией: список пересортировывается только при новых данных.
    select: sortTasksByUrgency,
  });
}

import type { Task } from './task';

const time = (iso: string | null) =>
  iso === null ? Infinity : new Date(iso).getTime();

/** Порядок групп: сначала активные со сроком, затем без срока, затем на проверке. */
function group(task: Task) {
  if (task.status === 'review') return 2;
  return task.expiresAt === null ? 1 : 0;
}

/**
 * Задачи по срочности. Бэкенд отдаёт их в своём порядке, сортируем на клиенте:
 * - активные — по времени окончания, ближайшие сверху;
 * - активные без срока — в конце активных;
 * - на проверке — после активных, дольше всех ждущие проверки сверху.
 */
export function sortTasksByUrgency(tasks: readonly Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const byGroup = group(a) - group(b);
    if (byGroup !== 0) return byGroup;
    if (a.status === 'review') return time(a.doneAt) - time(b.doneAt);
    if (a.expiresAt !== null) return time(a.expiresAt) - time(b.expiresAt);
    return 0;
  });
}

import type { Task } from './task';

type TaskFilter = {
  /** Задачи одного ребёнка. */
  assigneeId?: number;
  /** Задачи, созданные одним родителем. */
  createdBy?: number;
};

/** Задачи по фильтру; без фильтра — все. */
export const filterTasks = (
  tasks: readonly Task[],
  { assigneeId, createdBy }: TaskFilter = {},
) =>
  tasks.filter(
    (task) =>
      (assigneeId === undefined || task.assignee.id === assigneeId) &&
      (createdBy === undefined || task.createdBy === createdBy),
  );

/** Сколько задач активно и сколько ждёт проверки. */
export function countTasks(tasks: readonly Task[], filter?: TaskFilter) {
  let active = 0;
  let review = 0;
  for (const task of filterTasks(tasks, filter)) {
    if (task.status === 'review') review++;
    else active++;
  }
  return { active, review };
}

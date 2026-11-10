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

/**
 * Сколько задач активно и сколько ждёт проверки. Родитель считает только
 * свои задания (`createdBy`): их он проверяет, выплачивает и правит.
 */
export function countTasks(tasks: readonly Task[], filter?: TaskFilter) {
  let active = 0;
  let review = 0;
  for (const task of filterTasks(tasks, filter)) {
    if (task.status === 'active') active++;
    else if (task.status === 'review') review++;
  }
  return { active, review };
}

/**
 * Задания ребёнка глазами родителя: активные — все (от обоих родителей, чтобы
 * не задать то же самое), на проверке — только его: проверяет и платит автор.
 */
export function countChildTasks(
  tasks: readonly Task[],
  childId: number,
  parentId: number,
) {
  return {
    active: countTasks(tasks, { assigneeId: childId }).active,
    review: countTasks(tasks, { assigneeId: childId, createdBy: parentId })
      .review,
  };
}

/**
 * Сколько денег родителя в резерве: награды его заданий, которые ещё не
 * выплачены — активные и на проверке. Подтверждённое выплачено, из резерва
 * ушло.
 */
export function reservedRewards(tasks: readonly Task[], createdBy: number) {
  return filterTasks(tasks, { createdBy })
    .filter((task) => task.status === 'active' || task.status === 'review')
    .reduce((sum, task) => sum + task.reward, 0);
}

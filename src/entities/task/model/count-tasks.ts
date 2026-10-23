import type { Task } from './task';

/** Сколько задач активно и сколько ждёт проверки; с assigneeId — у одного ребёнка. */
export function countTasks(tasks: readonly Task[], assigneeId?: number) {
  let active = 0;
  let review = 0;
  for (const task of tasks) {
    if (assigneeId !== undefined && task.assignee.id !== assigneeId) continue;
    if (task.status === 'review') review++;
    else active++;
  }
  return { active, review };
}

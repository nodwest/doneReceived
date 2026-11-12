import { childrenMock, parentMock, tasksMock } from '@shared/mocks';
import type { ChecklistItem, Task, TaskAssignee } from '../model/task';
import type {
  ChecklistStepPayload,
  ChecklistTickPayload,
  CreateTaskPayload,
  RejectTaskPayload,
  TaskStatusPayload,
  UpdateTaskPayload,
} from '../model/types';

/**
 * Имитация бэкенда для моковых детей (Emma, Liam): задачи живут в памяти до
 * перезапуска приложения, стартовые данные — из моков. id в приложении —
 * строки: у моков это число строкой. Задания настоящих детей ходят в API
 * (./server-tasks-api).
 */
const toAssignee = (child: (typeof childrenMock)[number]): TaskAssignee => ({
  id: String(child.id),
  name: child.name,
  avatar: child.avatar,
});

let tasks: Task[] = tasksMock.map((task) => ({
  ...task,
  id: String(task.id),
  createdBy: String(task.createdBy),
  assignee: toAssignee(task.assignee),
  rejection: null,
  checklist:
    'checklist' in task ? task.checklist.map((item) => ({ ...item })) : [],
}));
let nextId = Math.max(...tasksMock.map((task) => task.id)) + 1;
let nextChecklistId = 1;

/**
 * Шаги из формы: сохранённые (с id) оставляют отметку ребёнка, новые
 * получают id и приходят неотмеченными, убранные пропадают.
 */
function toChecklist(
  steps: readonly ChecklistStepPayload[],
  current: readonly ChecklistItem[] = [],
): ChecklistItem[] {
  return steps.map((step) => ({
    id: step.id ?? `c${nextChecklistId++}`,
    title: step.title,
    done: current.find((item) => item.id === step.id)?.done ?? false,
  }));
}

function findAssignee(id: string) {
  const assignee = childrenMock.find((child) => String(child.id) === id);
  if (!assignee) throw new Error(`Assignee ${id} not found`);
  return toAssignee(assignee);
}

export const mockServer = {
  list: (): Task[] =>
    tasks.filter((task) => task.status !== 'done').map((task) => ({ ...task })),

  find: (id: string): Task => {
    const task = tasks.find((item) => item.id === id);
    if (!task) throw new Error(`Task ${id} not found`);
    return { ...task };
  },

  create: (payload: CreateTaskPayload): Task => {
    const task: Task = {
      id: String(nextId++),
      title: payload.title,
      description: payload.description,
      reward: payload.reward,
      status: 'active',
      assignee: findAssignee(payload.assigneeId),
      createdBy: String(parentMock.id),
      createdAt: new Date().toISOString(),
      expiresAt: payload.expiresAt,
      doneAt: null,
      photo: null,
      rejection: null,
      checklist: toChecklist(payload.checklist),
    };
    tasks = [task, ...tasks];
    return { ...task };
  },

  update: ({ id, ...payload }: UpdateTaskPayload): Task => {
    const current = tasks.find((task) => task.id === id);
    if (!current) throw new Error(`Task ${id} not found`);
    const updated: Task = {
      ...current,
      title: payload.title,
      description: payload.description,
      reward: payload.reward,
      expiresAt: payload.expiresAt,
      assignee: findAssignee(payload.assigneeId),
      checklist: toChecklist(payload.checklist, current.checklist),
    };
    tasks = tasks.map((task) => (task.id === id ? updated : task));
    return { ...updated };
  },

  /** Ребёнок отметил шаг чеклиста или снял отметку (только у активного). */
  tickChecklist: ({ id, itemId, done }: ChecklistTickPayload): Task => {
    const current = mockServer.find(id);
    if (current.status !== 'active') throw new Error(`Task ${id} not active`);
    const updated: Task = {
      ...current,
      checklist: current.checklist.map((item) =>
        item.id === itemId ? { ...item, done } : item,
      ),
    };
    tasks = tasks.map((task) => (task.id === id ? updated : task));
    return { ...updated };
  },

  setStatus: ({ id, status }: TaskStatusPayload): Task => {
    const current = tasks.find((task) => task.id === id);
    if (!current) throw new Error(`Task ${id} not found`);
    const updated: Task = {
      ...current,
      status,
      doneAt: status === 'review' ? new Date().toISOString() : null,
    };
    tasks = tasks.map((task) => (task.id === id ? updated : task));
    return { ...updated };
  },

  approve: (id: string): Task => {
    const current = mockServer.find(id);
    const updated: Task = { ...current, status: 'done', rejection: null };
    tasks = tasks.map((task) => (task.id === id ? updated : task));
    return { ...updated };
  },

  reject: ({ id, reason, comment }: RejectTaskPayload): Task => {
    const current = mockServer.find(id);
    const updated: Task = {
      ...current,
      status: 'active',
      doneAt: null,
      photo: null,
      rejection: { reason, comment, by: String(parentMock.id) },
    };
    tasks = tasks.map((task) => (task.id === id ? updated : task));
    return { ...updated };
  },

  cancel: (id: string) => {
    tasks = tasks.filter((task) => task.id !== id);
  },
};

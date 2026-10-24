import { childrenMock, parentMock, tasksMock } from '@shared/mocks';
import type { Task } from '../model/task';
import type { CreateTaskPayload, UpdateTaskPayload } from '../model/types';

/**
 * Имитация бэкенда, пока его нет: задачи живут в памяти до перезапуска
 * приложения, стартовые данные — из моков. Эндпоинты в ./tasks-api ходят сюда.
 * С настоящим API этот файл удаляется целиком.
 */
let tasks: Task[] = tasksMock.map((task) => ({ ...task }));
let nextId = Math.max(...tasks.map((task) => task.id)) + 1;

// Сервер сам подставляет исполнителя по id: в payload приходит только assigneeId.
function findAssignee(id: number) {
  const assignee = childrenMock.find((child) => child.id === id);
  if (!assignee) throw new Error(`Assignee ${id} not found`);
  return assignee;
}

export const mockServer = {
  // Копия, как после сериализации ответа: снаружи данные «сервера» не изменить.
  list: (): Task[] => tasks.map((task) => ({ ...task })),

  create: (payload: CreateTaskPayload): Task => {
    const task: Task = {
      id: nextId++,
      title: payload.title,
      description: payload.description,
      reward: payload.reward,
      status: 'active',
      assignee: findAssignee(payload.assigneeId),
      // Автора сервер берёт из сессии: задачу создаёт вошедший родитель.
      createdBy: parentMock.id,
      createdAt: new Date().toISOString(),
      expiresAt: payload.expiresAt,
      doneAt: null,
      photo: null,
    };
    // Порядок хранения не важен: клиент сортирует список сам (sortTasksByUrgency).
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
    };
    tasks = tasks.map((task) => (task.id === id ? updated : task));
    return { ...updated };
  },
};

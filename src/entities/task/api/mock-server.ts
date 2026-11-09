import { childrenMock, parentMock, tasksMock } from '@shared/mocks';
import type { Task } from '../model/task';
import type {
  CreateTaskPayload,
  RejectTaskPayload,
  TaskStatusPayload,
  UpdateTaskPayload,
} from '../model/types';

/**
 * Имитация бэкенда, пока его нет: задачи живут в памяти до перезапуска
 * приложения, стартовые данные — из моков. Эндпоинты в ./tasks-api ходят сюда.
 * С настоящим API этот файл удаляется целиком.
 */
let tasks: Task[] = tasksMock.map((task) => ({ ...task, rejection: null }));
let nextId = Math.max(...tasks.map((task) => task.id)) + 1;

// Сервер сам подставляет исполнителя по id: в payload приходит только assigneeId.
function findAssignee(id: number) {
  const assignee = childrenMock.find((child) => child.id === id);
  if (!assignee) throw new Error(`Assignee ${id} not found`);
  return assignee;
}

export const mockServer = {
  // Копия, как после сериализации ответа: снаружи данные «сервера» не изменить.
  // Подтверждённые задания ушли в историю: в списке их нет.
  list: (): Task[] =>
    tasks.filter((task) => task.status !== 'done').map((task) => ({ ...task })),

  find: (id: number): Task => {
    const task = tasks.find((item) => item.id === id);
    if (!task) throw new Error(`Task ${id} not found`);
    return { ...task };
  },

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
      rejection: null,
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

  // Ребёнок отправляет задание на проверку (review) или берёт назад (active).
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

  // Родитель подтвердил: задание выполнено и уходит в историю.
  approve: (id: number): Task => {
    const current = mockServer.find(id);
    const updated: Task = { ...current, status: 'done', rejection: null };
    tasks = tasks.map((task) => (task.id === id ? updated : task));
    return { ...updated };
  },

  // Родитель вернул задание: снова активно, с причиной; фото-отчёт сброшен.
  reject: ({ id, reason, comment }: RejectTaskPayload): Task => {
    const current = mockServer.find(id);
    const updated: Task = {
      ...current,
      status: 'active',
      doneAt: null,
      photo: null,
      // Кто вернул — вошедший родитель (с API сервер берёт его из сессии).
      rejection: { reason, comment, by: parentMock.id },
    };
    tasks = tasks.map((task) => (task.id === id ? updated : task));
    return { ...updated };
  },

  // Родитель отменил задание: оно пропадает без награды.
  cancel: (id: number) => {
    tasks = tasks.filter((task) => task.id !== id);
  },
};

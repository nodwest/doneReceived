import { operationsMock, parentMock } from '@shared/mocks';
import type { Operation, RewardPayload } from '../model/operation';

/**
 * Имитация бэкенда, пока его нет: история собирается из моков при загрузке,
 * даты отсчитываются от сегодняшнего дня. Эндпоинты в ./operations-api ходят
 * сюда. С настоящим API этот файл удаляется целиком.
 */
const today = new Date();

const MINUTE = 60_000;

let operations: Operation[] = operationsMock.map(
  ({ daysAgo, time, doneMinutesBefore, ...operation }) => {
    const [hours, minutes] = time.split(':').map(Number);
    const at = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - daysAgo,
      hours,
      minutes,
    );
    const doneAt =
      doneMinutesBefore === null
        ? null
        : new Date(at.getTime() - doneMinutesBefore * MINUTE).toISOString();
    return {
      ...operation,
      id: String(operation.id),
      child: { ...operation.child, id: String(operation.child.id) },
      parentId: String(operation.parentId),
      at: at.toISOString(),
      doneAt,
    };
  },
);

let nextId = Math.max(...operationsMock.map((operation) => operation.id)) + 1;

export const mockServer = {
  // Копия, как после сериализации ответа: снаружи данные «сервера» не изменить.
  list: (): Operation[] => operations.map((operation) => ({ ...operation })),

  // Родитель подтвердил задание: награда начислена сейчас, от его имени.
  addReward: (payload: RewardPayload): Operation => {
    const operation: Operation = {
      id: String(nextId++),
      kind: 'earned',
      title: payload.title,
      description: payload.description,
      amount: payload.amount,
      child: payload.child,
      // С API сервер берёт родителя из сессии.
      parentId: String(parentMock.id),
      at: new Date().toISOString(),
      doneAt: payload.doneAt,
      photo: payload.photo,
    };
    operations = [operation, ...operations];
    return { ...operation };
  },
};

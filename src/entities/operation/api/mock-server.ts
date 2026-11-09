import { operationsMock } from '@shared/mocks';
import type { Operation } from '../model/operation';

/**
 * Имитация бэкенда, пока его нет: история собирается из моков при загрузке,
 * даты отсчитываются от сегодняшнего дня. Эндпоинты в ./operations-api ходят
 * сюда. С настоящим API этот файл удаляется целиком.
 */
const today = new Date();

const MINUTE = 60_000;

const operations: Operation[] = operationsMock.map(
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
    return { ...operation, at: at.toISOString(), doneAt };
  },
);

export const mockServer = {
  // Копия, как после сериализации ответа: снаружи данные «сервера» не изменить.
  list: (): Operation[] => operations.map((operation) => ({ ...operation })),
};

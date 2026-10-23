import { operationsMock } from '@shared/mocks';
import type { Operation } from '../model/operation';

/**
 * Имитация бэкенда, пока его нет: история собирается из моков при загрузке,
 * даты отсчитываются от сегодняшнего дня. Эндпоинты в ./operations-api ходят
 * сюда. С настоящим API этот файл удаляется целиком.
 */
const today = new Date();

const operations: Operation[] = operationsMock.map(
  ({ daysAgo, time, ...operation }) => {
    const [hours, minutes] = time.split(':').map(Number);
    const at = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - daysAgo,
      hours,
      minutes,
    );
    return { ...operation, at: at.toISOString() };
  },
);

export const mockServer = {
  // Копия, как после сериализации ответа: снаружи данные «сервера» не изменить.
  list: (): Operation[] => operations.map((operation) => ({ ...operation })),
};

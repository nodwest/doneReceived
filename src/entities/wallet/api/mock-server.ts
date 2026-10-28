import { walletMock } from '@shared/mocks';
import type { Transaction, Wallet } from '../model/wallet';

/**
 * Имитация бэкенда, пока его нет: кошелёк собирается из моков при загрузке,
 * даты отсчитываются от сегодняшнего дня. Эндпоинты в ./wallet-api ходят
 * сюда. С настоящим API этот файл удаляется целиком.
 */
const today = new Date();

const transactions: Transaction[] = walletMock.transactions.map(
  ({ daysAgo, time, ...transaction }) => {
    const [hours, minutes] = time.split(':').map(Number);
    const at = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - daysAgo,
      hours,
      minutes,
    );
    return { ...transaction, at: at.toISOString() };
  },
);

export const mockServer = {
  // Копия, как после сериализации ответа: снаружи данные «сервера» не изменить.
  wallet: (): Wallet => ({
    balance: walletMock.balance,
    transactions: transactions.map((transaction) => ({ ...transaction })),
  }),
};

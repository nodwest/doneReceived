import {
  childProfilesMock,
  childWithdrawalsMock,
  operationsMock,
  parentMock,
  parentProfilesMock,
  walletMock,
} from '@shared/mocks';
import type {
  ChildTransaction,
  ChildWallet,
  PayoutTransaction,
  Transaction,
  Wallet,
} from '../model/wallet';

/**
 * Имитация бэкенда, пока его нет: кошельки собираются из моков при загрузке,
 * даты отсчитываются от сегодняшнего дня. Выплаты и награды за задания — это
 * начисленные награды из истории (operationsMock), поэтому из транзакции
 * можно открыть карточку задания в Rewards history. Эндпоинты в ./wallet-api
 * ходят сюда. С настоящим API этот файл удаляется целиком.
 */
const today = new Date();
const MINUTE = 60_000;

/** ISO-время: «N дней назад в HH:MM». */
function at(daysAgo: number, time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - daysAgo,
    hours,
    minutes,
  );
}

// Начисленные награды из истории: та же дата и то же время сдачи задания.
const rewards = operationsMock
  .filter((operation) => operation.kind === 'earned')
  .map((operation) => {
    const date = at(operation.daysAgo, operation.time);
    const doneAt =
      operation.doneMinutesBefore === null
        ? null
        : new Date(
            date.getTime() - operation.doneMinutesBefore * MINUTE,
          ).toISOString();
    return { ...operation, at: date.toISOString(), doneAt };
  });

const byNewest = <T extends { at: string }>(items: T[]) =>
  items.sort((a, b) => b.at.localeCompare(a.at));

// Кошелёк Sarah: выплаты за её задания и операции с картой.
const payouts: PayoutTransaction[] = rewards
  .filter((reward) => reward.parentId === parentMock.id)
  .map((reward) => ({
    id: reward.id,
    kind: 'payout',
    amount: reward.amount,
    at: reward.at,
    child: reward.child,
    task: reward.title,
    operationId: reward.id,
    taskDoneAt: reward.doneAt,
  }));

const parentTransactions: Transaction[] = byNewest([
  ...payouts,
  ...walletMock.cardTransactions.map(({ daysAgo, time, ...transaction }) => ({
    ...transaction,
    at: at(daysAgo, time).toISOString(),
  })),
]);

function childTransactions(childId: number): ChildTransaction[] {
  return byNewest<ChildTransaction>([
    ...rewards
      .filter((reward) => reward.child.id === childId)
      .map((reward) => {
        const parent =
          parentProfilesMock.find((item) => item.id === reward.parentId) ??
          parentProfilesMock[0];
        return {
          id: reward.id,
          kind: 'reward' as const,
          amount: reward.amount,
          at: reward.at,
          from: { id: parent.id, name: parent.name, avatar: parent.avatar },
          task: reward.title,
          operationId: reward.id,
          taskDoneAt: reward.doneAt,
        };
      }),
    ...childWithdrawalsMock
      .filter((withdrawal) => withdrawal.child.id === childId)
      .map(({ id, daysAgo, time, amount, card }) => ({
        id,
        kind: 'withdrawal' as const,
        amount,
        card,
        at: at(daysAgo, time).toISOString(),
      })),
  ]);
}

export const mockServer = {
  // Копия, как после сериализации ответа: снаружи данные «сервера» не изменить.
  wallet: (): Wallet => ({
    balance: walletMock.balance,
    transactions: parentTransactions.map((transaction) => ({
      ...transaction,
    })),
  }),
  childWallet: (childId: number): ChildWallet => ({
    balance:
      childProfilesMock.find((child) => child.id === childId)?.balance ?? 0,
    transactions: childTransactions(childId),
  }),
};

import { childrenMock } from './children';

const [emma, liam] = childrenMock;

/**
 * Кошелёк вошедшего родителя (Sarah): баланс и операции с картой — пополнение
 * (deposit) и вывод (withdrawal); даты — «дней назад» от сегодня. Выплаты
 * детям за задания (payout) mock-server берёт из истории наград
 * (operationsMock): задания, которые дала и подтвердила Sarah.
 */
export const walletMock = {
  // Баланс для моковой истории транзакций; деньги родителя на экранах — с
  // сервера (GET /families/:id/wallet).
  balance: 1000,
  cardTransactions: [
    {
      id: 1001,
      kind: 'deposit',
      daysAgo: 0,
      time: '09:00',
      amount: 50,
      card: '4242',
    },
    {
      id: 1002,
      kind: 'withdrawal',
      daysAgo: 1,
      time: '13:30',
      amount: 20,
      card: '4242',
    },
    {
      id: 1003,
      kind: 'deposit',
      daysAgo: 5,
      time: '10:00',
      amount: 100,
      card: '4242',
    },
    {
      id: 1004,
      kind: 'withdrawal',
      daysAgo: 9,
      time: '13:30',
      amount: 20,
      card: '4242',
    },
    {
      id: 1005,
      kind: 'deposit',
      daysAgo: 12,
      time: '08:45',
      amount: 50,
      card: '4242',
    },
  ],
} as const;

/**
 * Выводы детей на свою карту; награды (reward) mock-server берёт из истории
 * наград. Баланс ребёнка — в childProfilesMock.
 */
export const childWithdrawalsMock = [
  {
    id: 2001,
    child: emma,
    daysAgo: 1,
    time: '19:30',
    amount: 10,
    card: '5678',
  },
  {
    id: 2002,
    child: emma,
    daysAgo: 6,
    time: '12:10',
    amount: 15,
    card: '5678',
  },
  { id: 2003, child: liam, daysAgo: 3, time: '18:00', amount: 8, card: '9012' },
] as const;

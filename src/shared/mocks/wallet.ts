import { childrenMock } from './children';

const [emma, liam] = childrenMock;

/**
 * Кошелёк вошедшего родителя: баланс и транзакции (сначала новые; даты —
 * «дней назад» от сегодня). payout — выплата награды ребёнку за задачу,
 * deposit и withdrawal — пополнение с карты и вывод на карту.
 */
export const walletMock = {
  balance: 240,
  transactions: [
    {
      id: 1,
      kind: 'payout',
      daysAgo: 0,
      time: '18:12',
      amount: 4,
      child: emma,
      task: 'Clean your room',
    },
    {
      id: 2,
      kind: 'deposit',
      daysAgo: 0,
      time: '09:00',
      amount: 50,
      card: '4242',
    },
    {
      id: 3,
      kind: 'payout',
      daysAgo: 1,
      time: '16:40',
      amount: 3,
      child: liam,
      task: 'Walk the dog',
    },
    {
      id: 4,
      kind: 'payout',
      daysAgo: 8,
      time: '11:05',
      amount: 2,
      child: emma,
      task: 'Water the plants',
    },
    {
      id: 5,
      kind: 'withdrawal',
      daysAgo: 9,
      time: '13:30',
      amount: 20,
      card: '4242',
    },
    {
      id: 6,
      kind: 'payout',
      daysAgo: 10,
      time: '20:30',
      amount: 3,
      child: liam,
      task: 'Wash the dishes',
    },
  ],
} as const;

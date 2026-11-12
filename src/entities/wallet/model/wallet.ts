import type { ImageSourcePropType } from 'react-native';
import { startOfDay } from '@shared/lib';

/** Участник семьи в транзакции: ребёнок, получивший выплату, или родитель. */
export interface TransactionPerson {
  /** У моков число строкой, с сервера — UUID. */
  id: string;
  name: string;
  /** null — фото нет, буква имени. */
  avatar: ImageSourcePropType | null;
}

interface TransactionBase {
  id: number;
  amount: number;
  /** ISO-время транзакции. */
  at: string;
}

/** За какое задание пришли деньги: ссылка на награду в истории. */
interface TaskPayment {
  /** Название задания. */
  task: string;
  /** id награды в истории (Rewards history), по нему открывается карточка. */
  operationId: string;
  /** ISO-время, когда ребёнок отметил задание выполненным. */
  taskDoneAt: string | null;
}

/** Выплата награды ребёнку за задачу: деньги уходят с баланса родителя. */
export interface PayoutTransaction extends TransactionBase, TaskPayment {
  kind: 'payout';
  child: TransactionPerson;
}

/** Выплата за подтверждённое задание: из кошелька родителя ребёнку. */
export type PayoutPayload = Omit<PayoutTransaction, 'id' | 'kind'>;

/** Пополнение с карты или вывод на карту. */
export interface CardTransaction extends TransactionBase {
  kind: 'deposit' | 'withdrawal';
  /** Последние 4 цифры карты. */
  card: string;
}

export type Transaction = PayoutTransaction | CardTransaction;

export type TransactionKind = Transaction['kind'];

/** Кошелёк вошедшего родителя: баланс и транзакции, сначала новые. */
export interface Wallet {
  balance: number;
  transactions: Transaction[];
}

/** Награда ребёнку за задание: деньги приходят на его баланс. */
export interface RewardTransaction
  extends TransactionBase, Omit<TaskPayment, 'operationId'> {
  kind: 'reward';
  /** id награды в истории; null — карточки в истории у неё нет. */
  operationId: string | null;
  /** Родитель, который дал и подтвердил задание; имя может быть пустым. */
  from: TransactionPerson;
}

/** Вывод ребёнком денег на карту. */
export interface ChildWithdrawal extends TransactionBase {
  kind: 'withdrawal';
  card: string;
}

export type ChildTransaction = RewardTransaction | ChildWithdrawal;

/** Кошелёк ребёнка: баланс и транзакции, сначала новые. */
export interface ChildWallet {
  balance: number;
  transactions: ChildTransaction[];
}

type AnyTransaction = Transaction | ChildTransaction;

/** Пополнение и награда добавляют деньги, выплата и вывод — забирают. */
export const isIncome = ({ kind }: AnyTransaction) =>
  kind === 'deposit' || kind === 'reward';

/** Сумма со знаком: +50 или -4. */
export const signedAmount = (transaction: AnyTransaction) =>
  isIncome(transaction) ? transaction.amount : -transaction.amount;

/** Баланс с центами: «$240.00». */
export const formatBalance = (amount: number) => `$${amount.toFixed(2)}`;

/** Сумма транзакции со знаком: пополнение «+$50», выплата и вывод «-$4». */
export const formatTransactionAmount = (transaction: AnyTransaction) =>
  `${isIncome(transaction) ? '+' : '−'}$${transaction.amount}`;

/** Крупная сумма в карточке транзакции: «+$50.00», «−$4.00». */
export const formatTransactionTotal = (transaction: AnyTransaction) =>
  `${isIncome(transaction) ? '+' : '−'}${formatBalance(transaction.amount)}`;

/**
 * Баланс сразу после транзакции: нынешний баланс без всего, что случилось
 * позже неё. Транзакции — в любом порядке.
 */
export function balanceAfter<T extends AnyTransaction>(
  transactions: readonly T[],
  balance: number,
  transaction: T,
) {
  const later = transactions
    .filter((other) => other.at > transaction.at)
    .reduce((sum, other) => sum + signedAmount(other), 0);
  return balance - later;
}

/** Номер транзакции для поддержки: «TX-4F8K-2Q7M». */
export function transactionCode(id: number) {
  const raw = ((id * 2654435761) % 4294967296)
    .toString(36)
    .toUpperCase()
    .padStart(8, '0')
    .slice(-8);
  return `TX-${raw.slice(0, 4)}-${raw.slice(4)}`;
}

/** Транзакции одного дня и его итоги: сколько пришло и сколько ушло. */
export interface TransactionDay<T> {
  /** Полночь дня по местному времени. */
  date: Date;
  items: T[];
  income: number;
  outcome: number;
}

/** Транзакции по дням, сначала новые; внутри дня — тоже сначала новые. */
export function groupByDay<T extends AnyTransaction>(
  transactions: readonly T[],
): TransactionDay<T>[] {
  const days = new Map<number, TransactionDay<T>>();
  const sorted = [...transactions].sort((a, b) => b.at.localeCompare(a.at));
  for (const transaction of sorted) {
    const date = startOfDay(new Date(transaction.at));
    const key = date.getTime();
    let day = days.get(key);
    if (!day) {
      day = { date, items: [], income: 0, outcome: 0 };
      days.set(key, day);
    }
    day.items.push(transaction);
    if (isIncome(transaction)) day.income += transaction.amount;
    else day.outcome += transaction.amount;
  }
  return [...days.values()];
}

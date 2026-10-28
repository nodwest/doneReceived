import type { ImageSourcePropType } from 'react-native';

export interface TransactionChild {
  id: number;
  name: string;
  avatar: ImageSourcePropType;
}

interface TransactionBase {
  id: number;
  amount: number;
  /** ISO-время транзакции. */
  at: string;
}

/** Выплата награды ребёнку за задачу: деньги уходят с баланса родителя. */
export interface PayoutTransaction extends TransactionBase {
  kind: 'payout';
  child: TransactionChild;
  task: string;
}

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

/** Баланс с центами: «$240.00». */
export const formatBalance = (amount: number) => `$${amount.toFixed(2)}`;

/** Сумма транзакции со знаком: пополнение «+$50», выплата и вывод «-$4». */
export const formatTransactionAmount = ({ kind, amount }: Transaction) =>
  `${kind === 'deposit' ? '+' : '-'}$${amount}`;

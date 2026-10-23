import type { ImageSourcePropType } from 'react-native';

/** earned — награда начислена; missed — задача не выполнена в срок, награда упущена. */
export type OperationKind = 'earned' | 'missed';

export interface OperationChild {
  id: number;
  name: string;
  avatar: ImageSourcePropType;
}

export interface Operation {
  id: number;
  title: string;
  kind: OperationKind;
  amount: number;
  child: OperationChild;
  /** ISO-время операции. */
  at: string;
}

/** Сумма в формате истории: «$10». */
export const formatAmount = (amount: number) => `$${amount}`;

/** Сначала новые. */
export const sortByNewest = (operations: Operation[]) =>
  [...operations].sort((a, b) => b.at.localeCompare(a.at));

import type { ImageSourcePropType } from 'react-native';

/** earned — награда начислена; missed — задача не выполнена в срок, награда упущена. */
export type OperationKind = 'earned' | 'missed';

/** Ребёнок в истории: у моков id — число строкой, с сервера — UUID. */
export interface OperationChild {
  id: string;
  name: string;
  /** null — фото нет, буква имени. */
  avatar: ImageSourcePropType | null;
}

export interface Operation {
  /** У моков число строкой, с сервера — id начисления или назначения. */
  id: string;
  title: string;
  kind: OperationKind;
  amount: number;
  child: OperationChild;
  /**
   * id родителя, создавшего задачу (он же её подтвердил): у моков число
   * строкой, у вошедшего родителя — id моковой Sarah, у второго — его userId.
   */
  parentId: string;
  /** ISO-время операции: награда начислена или упущена. */
  at: string;
  /** Что нужно было сделать: описание задания. */
  description: string;
  /** ISO-время, когда ребёнок отметил задание выполненным; у упущенных — null. */
  doneAt: string | null;
  /** Фото-отчёт ребёнка; null — снимка нет. */
  photo: ImageSourcePropType | null;
  /** Комментарий ребёнка к сдаче; null — без комментария. */
  note: string | null;
  /**
   * С сервера: id назначения, за которое начислено. По нему выплата в
   * транзакциях родителя открывает эту награду.
   */
  assignmentId?: string;
}

/** Что сервер записывает в историю, когда родитель подтвердил задание. */
export type RewardPayload = Pick<
  Operation,
  'title' | 'description' | 'amount' | 'child' | 'doneAt' | 'photo' | 'note'
>;

/** Сумма в формате истории: «$10». */
export const formatAmount = (amount: number) => `$${amount}`;

/** Сначала новые. */
export const sortByNewest = (operations: Operation[]) =>
  [...operations].sort((a, b) => b.at.localeCompare(a.at));

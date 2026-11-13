import type { ImageSourcePropType } from 'react-native';

/**
 * active — ребёнок выполняет; review — отмечено выполненным, ждёт проверки
 * родителя; done — родитель подтвердил, награда выплачена, задание ушло в
 * историю (в списке заданий его больше нет).
 */
export type TaskState = 'active' | 'review' | 'done';

/** Почему родитель вернул задание; подписи — reviewTask.reasons.*. */
export type RejectReasonKey = 'not-done-properly' | 'not-finished' | 'other';

/** Отказ родителя: задание снова активно, ребёнок видит, что переделать. */
export interface TaskRejection {
  reason: RejectReasonKey;
  /** Комментарий родителя; пустая строка — без комментария. */
  comment: string;
  /** id родителя, который вернул задание. */
  by: string;
}

/** Шаг чеклиста задания: ребёнок отмечает его по ходу дела. */
export interface ChecklistItem {
  /** id шага: у моков — строка-счётчик, с сервера — UUID. */
  id: string;
  title: string;
  /** Ребёнок отметил шаг. */
  done: boolean;
}

/** Сколько шагов в чеклисте и сколько символов в шаге (как на сервере). */
export const CHECKLIST_MAX_ITEMS = 20;
export const CHECKLIST_ITEM_MAX_LENGTH = 120;

/**
 * Сколько символов в комментарии ребёнка к сдаче. Сервер принимает до 2000,
 * но комментарий — пара фраз «чего не было в магазине».
 */
export const TASK_NOTE_MAX_LENGTH = 300;

export interface TaskAssignee {
  /** id ребёнка: у моков — число строкой, с сервера — UUID профиля. */
  id: string;
  name: string;
  /** Фото; null — у ребёнка с сервера фото пока нет (буква имени). */
  avatar: ImageSourcePropType | null;
}

export interface Task {
  /**
   * id задачи в приложении: у моков — число строкой, с сервера — UUID
   * назначения (задание на одного ребёнка).
   */
  id: string;
  /**
   * Задание с сервера: id задания (для правки и отмены). У моковых — нет.
   * Один `serverTaskId` может быть у нескольких назначений, но пока задание
   * назначается одному ребёнку.
   */
  serverTaskId?: string;
  /**
   * Задание с сервера на проверке: id отчёта, который ждёт решения (по нему
   * Approve, Reject и Redo). У моковых и не сданных — нет.
   */
  submissionId?: string;
  title: string;
  description: string;
  reward: number;
  status: TaskState;
  assignee: TaskAssignee;
  /**
   * id родителя, создавшего задачу. Задания с сервера, созданные вошедшим
   * родителем, помечены тем же id, что моковые задания Sarah (`OWN_TASK_AUTHOR`
   * в запросе списка): экраны считают их «моими».
   */
  createdBy: string;
  /**
   * Имя автора с сервера (участники семьи); у моковых и пока список
   * участников недоступен (ребёнку) — нет, имя берут из моков.
   */
  authorName?: string;
  /** Фото автора из участников семьи; нет — буква имени. */
  authorAvatar?: ImageSourcePropType | null;
  /** ISO-время создания. */
  createdAt: string;
  /** ISO-время, когда задача перестаёт быть активной; null — без срока. */
  expiresAt: string | null;
  /** ISO-время, когда ребёнок отметил задачу выполненной. */
  doneAt: string | null;
  /** Фото-отчёт ребёнка (до 3), с сервера — с токеном; пусто — без фото. */
  photos: ImageSourcePropType[];
  /**
   * Комментарий ребёнка к сданному заданию («в магазине не было масла»);
   * null — без комментария или задание ещё не сдано.
   */
  note: string | null;
  /** Последний отказ родителя; null — задание не возвращали. */
  rejection: TaskRejection | null;
  /** Чеклист по порядку; пустой — задание без чеклиста. */
  checklist: ChecklistItem[];
}

/** Награда в формате карточек: «$5.00». */
export const formatReward = (reward: number) => `$${reward.toFixed(2)}`;

/** Награда коротко, без копеек: «$5». */
export const formatRewardShort = (reward: number) =>
  Number.isInteger(reward) ? `$${reward}` : `$${reward.toFixed(2)}`;

/** Сколько фото можно приложить к отчёту: столько принимает сервер. */
export const TASK_PHOTOS_MAX = 3;

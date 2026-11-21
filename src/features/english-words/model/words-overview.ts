import type { Task } from '@entities/task';
import type { ChildWallet } from '@entities/wallet';
import {
  learnedWordsCount,
  WORDS_PER_DAY,
  parseWordsRange,
  WORDS_TOTAL,
  wordsDay,
  wordsOfTask,
  type Word,
  type WordsRange,
} from '@entities/word';

/**
 * Где ребёнок в словах:
 * none — слов не выдали (родитель ещё не начал);
 * learning — учит слова задания;
 * review — выучил, ждёт вечерней проверки;
 * tomorrow — сегодня уже проверили и заплатили, следующие слова откроются завтра;
 * finished — весь словарь пройден.
 */
export type WordsStatus =
  | 'none'
  | 'learning'
  | 'review'
  | 'tomorrow'
  | 'finished';

export interface WordsOverview {
  status: WordsStatus;
  /** Сколько слов выучено (по принятым заданиям). */
  learned: number;
  /** Текущее задание со словами (учит или на проверке). */
  task: Task | null;
  range: WordsRange | null;
  words: Word[];
  /** За слова сегодня (день — с 4:00) уже заплатили. */
  paidToday: boolean;
}

/** Награда из кошелька ребёнка: название задания и когда начислена. */
type Reward = { task: string; at: string };

/** Награды из кошелька ребёнка (выводы не нужны); не загружен — пусто. */
export const rewardsOf = (wallet: ChildWallet | undefined): Reward[] =>
  (wallet?.transactions ?? []).flatMap((item) =>
    item.kind === 'reward' ? [{ task: item.task, at: item.at }] : [],
  );

/**
 * Состояние слов одного ребёнка из его заданий и наград. Слова в день одни:
 * если сегодня за слова уже заплатили, следующая порция (её создают сразу
 * после проверки) ждёт завтрашнего дня — он начинается в 4:00.
 */
export function getWordsOverview(
  tasks: readonly Task[],
  rewards: readonly Reward[],
  now = new Date(),
): WordsOverview {
  // Если заданий со словами вдруг несколько — сначала самое раннее по словам.
  const wordsTasks = tasks
    .filter((task) => parseWordsRange(task.title) !== null)
    .sort(
      (a, b) =>
        (parseWordsRange(a.title)?.from ?? 0) -
        (parseWordsRange(b.title)?.from ?? 0),
    );
  const task =
    wordsTasks.find((item) => item.status === 'review') ??
    wordsTasks.find((item) => item.status === 'active') ??
    null;
  const wordsRewards = rewards.filter(
    (reward) => parseWordsRange(reward.task) !== null,
  );
  const learned = learnedWordsCount(wordsRewards.map((reward) => reward.task));
  const today = wordsDay(now);
  const paidToday = wordsRewards.some(
    (reward) => wordsDay(reward.at) === today,
  );
  const range = task ? parseWordsRange(task.title) : null;
  const words = task ? wordsOfTask(task.title, task.checklist) : [];

  let status: WordsStatus;
  if (task?.status === 'review') status = 'review';
  else if (task)
    status = paidToday && !task.rejection ? 'tomorrow' : 'learning';
  else status = learned >= WORDS_TOTAL ? 'finished' : 'none';

  return { status, learned, task, range, words, paidToday };
}

/**
 * С какого слова открыть полный список и какие слова в нём сегодняшние:
 * на проверке — слова задания, сдано — последняя выученная порция, слов ещё
 * не дали — следующее слово, без выделения.
 */
export function deckFocus({ status, range, learned }: WordsOverview): {
  start: number;
  today: WordsRange | null;
} {
  if ((status === 'review' || status === 'learning') && range) {
    return { start: range.from, today: range };
  }
  if ((status === 'tomorrow' || status === 'finished') && learned > 0) {
    const from = Math.floor((learned - 1) / WORDS_PER_DAY) * WORDS_PER_DAY + 1;
    return { start: from, today: { from, to: learned } };
  }
  return { start: Math.min(learned + 1, WORDS_TOTAL), today: null };
}

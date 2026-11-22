import { isWordsTask, type Task } from '@entities/task';
import type { ChildWallet } from '@entities/wallet';
import {
  rangeOfRanks,
  WORDS_TOTAL,
  type Word,
  type WordsRange,
  type WordsState,
} from '@entities/word';

/**
 * Где ребёнок в словах (по состоянию с сервера):
 * off — родитель ещё не включил слова;
 * learning — учит слова порции;
 * redo — проверка не прошла: повторяет слова порции, невыученные помечены;
 * review — выучил, ждёт вечерней проверки;
 * tomorrow — сегодня уже проверили и заплатили, следующие слова завтра;
 * noFunds — пора дать новые слова, а у родителя не хватает денег на награду;
 * finished — весь словарь пройден.
 */
export type WordsStatus =
  | 'off'
  | 'learning'
  | 'redo'
  | 'review'
  | 'tomorrow'
  | 'noFunds'
  | 'finished';

const STATUSES: Record<WordsState['status'], WordsStatus> = {
  off: 'off',
  learning: 'learning',
  redo: 'redo',
  review: 'review',
  done_today: 'tomorrow',
  no_funds: 'noFunds',
  finished: 'finished',
};

/** Награда за слова из кошелька ребёнка: когда, сколько и какие слова. */
export type WordsReward = { at: string; amount: number; range: WordsRange };

/** Награды за слова дня из кошелька ребёнка; не загружен — пусто. */
export const wordsRewardsOf = (
  wallet: ChildWallet | undefined,
): WordsReward[] =>
  (wallet?.transactions ?? []).flatMap((item) =>
    item.kind === 'reward' && item.words
      ? [{ at: item.at, amount: item.amount, range: item.words }]
      : [],
  );

export interface WordsOverview {
  status: WordsStatus;
  /** Сколько слов выучено. */
  learned: number;
  /** Сколько слов в словаре для детей. */
  total: number;
  /** Награда за сданный день; null — слова ещё не настроены. */
  reward: number | null;
  /** Родитель, из чьего кошелька платим. */
  payerId: string | null;
  /** Задание текущей порции (учит или на проверке); список ещё не пришёл — null. */
  task: Task | null;
  /** Новые слова порции по порядку. */
  words: Word[];
  /** Не вспомнил на проверке (новые и пройденные), по порядку словаря. */
  missed: Word[];
  range: WordsRange | null;
  /** Последняя оплаченная порция (из кошелька ребёнка). */
  lastRange: WordsRange | null;
}

/**
 * Статус порции сверяем с её заданием: назначение — то, что сервер точно
 * обновил. Сдано — на проверке; снова активно после отказа — повторяет
 * (`GET …/words` после неудачной проверки отдаёт review, п. 38); активно без
 * отказа — учит.
 */
function portionStatus(status: WordsStatus, task: Task | null): WordsStatus {
  if (!task) return status;
  if (task.status === 'review') return 'review';
  if (task.status === 'active') return task.rejection ? 'redo' : 'learning';
  return status;
}

/**
 * Слова одного ребёнка: состояние с сервера, задание порции из его заданий
 * (по `portionId`) и последняя оплаченная порция из наград в кошельке.
 */
export function getWordsOverview(
  state: WordsState,
  tasks: readonly Task[],
  rewards: readonly WordsReward[] = [],
): WordsOverview {
  const portion = state.portion;
  const wordsTasks = tasks.filter(isWordsTask);
  const task =
    (portion
      ? wordsTasks.find((item) => item.words?.portionId === portion.portionId)
      : undefined) ??
    (state.status === 'learning' || state.status === 'review'
      ? (wordsTasks.find((item) => item.status === 'review') ??
        wordsTasks.find((item) => item.status === 'active'))
      : undefined) ??
    null;
  const source = task?.words ?? portion;
  const newRanks = new Set(source?.ranks ?? []);
  const words = (source?.items ?? [])
    .filter((word) => newRanks.has(word.rank))
    .sort((a, b) => a.rank - b.rank);
  const latest = [...rewards].sort((a, b) => b.at.localeCompare(a.at))[0];
  const missedRanks = new Set(
    state.missedRanks ?? task?.rejection?.missedRanks ?? [],
  );
  const missed = (source?.items ?? [])
    .filter((word) => missedRanks.has(word.rank))
    .sort((a, b) => a.rank - b.rank);

  return {
    status: portionStatus(STATUSES[state.status] ?? 'off', task),
    learned: state.learnedCount,
    total: state.totalCount || WORDS_TOTAL,
    reward: state.rewardPoints,
    payerId: state.payerId,
    task,
    words,
    missed,
    range: rangeOfRanks(source?.ranks ?? []),
    lastRange: latest?.range ?? null,
  };
}

/**
 * С какого слова открыть полный список и какие слова в нём сегодняшние:
 * учит или на проверке — слова порции, сдано — последняя оплаченная порция,
 * иначе — слово после последней порции, без выделения.
 */
export function deckFocus({ status, range, lastRange }: WordsOverview): {
  start: number;
  today: WordsRange | null;
} {
  if (
    (status === 'review' || status === 'learning' || status === 'redo') &&
    range
  ) {
    return { start: range.from, today: range };
  }
  if ((status === 'tomorrow' || status === 'finished') && lastRange) {
    return { start: lastRange.from, today: lastRange };
  }
  return {
    start: Math.min((lastRange?.to ?? 0) + 1, WORDS_TOTAL),
    today: null,
  };
}

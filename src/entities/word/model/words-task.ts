import { WORDS } from './words-deck';

/**
 * «Слова дня» решает сервер (п. 37): он выдаёт ребёнку порцию — обычное
 * назначение задания с полем `words` (новые слова и пройденные для проверки),
 * резервирует награду у родителя-плательщика и после проверки выплачивает её.
 */

/** Сколько новых слов в день (сервер пока принимает только 10). */
export const WORDS_PER_DAY = 10;
/** Сколько пройденных слов сервер добавляет к проверке (`reviewCount`). */
export const WORDS_REVIEW_COUNT = 5;
/** Сколько можно назначить за день (как на сервере). */
export const WORDS_REWARD_MAX = 1000;

export interface WordsRange {
  /** Номер первого слова по частоте. */
  from: number;
  /** Номер последнего слова (включительно). */
  to: number;
}

/** Номера первого и последнего слова; пусто — null. */
export function rangeOfRanks(ranks: readonly number[]): WordsRange | null {
  if (ranks.length === 0) return null;
  return { from: Math.min(...ranks), to: Math.max(...ranks) };
}

/** Сколько всего слов в словаре приложения (для просмотра всех слов). */
export const WORDS_TOTAL = WORDS.length;

/** Слова диапазона по порядку (из словаря приложения). */
export const wordsInRange = ({ from, to }: WordsRange) =>
  WORDS.filter((word) => word.rank >= from && word.rank <= to);

/** Перемешать копию массива (Фишер — Йетс). */
export function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Час, с которого начинается новый день слов: поздно ночью ещё можно
 * заниматься, и это считается предыдущим днём (так же считает сервер).
 */
export const WORDS_DAY_START_HOUR = 4;

/** День слов для момента времени: «2026-11-20» с учётом начала в 4:00. */
export function wordsDay(date: Date | string): string {
  const shifted = new Date(
    new Date(date).getTime() - WORDS_DAY_START_HOUR * 60 * 60 * 1000,
  );
  return `${shifted.getFullYear()}-${shifted.getMonth() + 1}-${shifted.getDate()}`;
}

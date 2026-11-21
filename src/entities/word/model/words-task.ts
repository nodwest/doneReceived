import type { Word } from './word';
import { getWord, WORDS } from './words-deck';

/**
 * «Слова дня» — обычное задание на сервере: название `English words v2 #11–20`
 * (по нему экраны узнают задание и номера слов), в чеклисте по шагу на слово
 * (`#11 like`). Награда резервируется у родителя при создании и уходит
 * ребёнку, когда родитель принял проверку, — как у любого задания.
 */

/** Сколько новых слов в день. */
export const WORDS_PER_DAY = 10;
/** Сколько пройденных слов родитель спрашивает вперемешку с новыми. */
export const WORDS_REVIEW_COUNT = 5;
/**
 * Награда за день по умолчанию, в долларах; родитель выбирает свою при
 * первом входе на вкладку (`useWordsReward`).
 */
export const WORDS_REWARD = 10;
/** Сколько можно назначить за день. */
export const WORDS_REWARD_MAX = 1000;

export interface WordsRange {
  /** Номер первого слова по частоте. */
  from: number;
  /** Номер последнего слова (включительно). */
  to: number;
}

const TITLE_PREFIX = 'English words v2';
const TITLE_PATTERN = /^English words v2 #(\d+)[–-](\d+)$/;
const STEP_PATTERN = /^#(\d+)\s/;

/** Название задания: `English words v2 #11–20`. */
export const wordsTaskTitle = ({ from, to }: WordsRange) =>
  `${TITLE_PREFIX} #${from}–${to}`;

/** Номера слов из названия задания; не слова дня — null. */
export function parseWordsRange(title: string): WordsRange | null {
  const match = TITLE_PATTERN.exec(title.trim());
  if (!match) return null;
  return { from: Number(match[1]), to: Number(match[2]) };
}

/**
 * Задание со словами. Такие задания никогда не показываются обычными
 * заданиями: в списках и каруселях их нет, у слов своя строка.
 */
export const isWordsTitle = (title: string) => parseWordsRange(title) !== null;

/** Шаг чеклиста для слова: `#11 like`. */
export const wordStepTitle = (word: Word) => `#${word.rank} ${word.word}`;

/** Сколько всего слов в словаре. */
export const WORDS_TOTAL = WORDS.length;

/** Слова диапазона по порядку. */
export const wordsInRange = ({ from, to }: WordsRange) =>
  WORDS.filter((word) => word.rank >= from && word.rank <= to);

/**
 * Слова задания: из шагов чеклиста (`#11 like`), иначе — по номерам в
 * названии. Неизвестные номера пропускаются.
 */
export function wordsOfTask(
  title: string,
  steps: readonly { title: string }[],
): Word[] {
  const ranks = steps
    .map((step) => STEP_PATTERN.exec(step.title))
    .map((match) => (match ? Number(match[1]) : null))
    .filter((rank): rank is number => rank !== null);
  if (ranks.length > 0) {
    return ranks.map(getWord).filter((word): word is Word => word !== null);
  }
  const range = parseWordsRange(title);
  return range ? wordsInRange(range) : [];
}

/**
 * Сколько слов уже выучено: последний номер из принятых заданий со словами
 * (по названиям наград в кошельке ребёнка).
 */
export function learnedWordsCount(rewardTitles: readonly string[]) {
  return rewardTitles.reduce(
    (max, title) => Math.max(max, parseWordsRange(title)?.to ?? 0),
    0,
  );
}

/** Следующая порция после `learned` слов; словарь пройден — null. */
export function nextWordsRange(learned: number): WordsRange | null {
  if (learned >= WORDS_TOTAL) return null;
  const from = learned + 1;
  return { from, to: Math.min(from + WORDS_PER_DAY - 1, WORDS_TOTAL) };
}

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
 * Колода проверки: слова задания и до WORDS_REVIEW_COUNT случайных из
 * пройденных раньше (номера меньше первого слова задания), вперемешку.
 */
export function buildCheckDeck(words: readonly Word[]): Word[] {
  if (words.length === 0) return [];
  const first = Math.min(...words.map((word) => word.rank));
  const learnedBefore = WORDS.filter((word) => word.rank < first);
  const review = shuffled(learnedBefore).slice(0, WORDS_REVIEW_COUNT);
  return shuffled([...words, ...review]);
}

/**
 * Час, с которого начинается новый день слов: поздно ночью ещё можно
 * заниматься, и это считается предыдущим днём.
 */
export const WORDS_DAY_START_HOUR = 4;

/** День слов для момента времени: «2026-11-20» с учётом начала в 4:00. */
export function wordsDay(date: Date | string): string {
  const shifted = new Date(
    new Date(date).getTime() - WORDS_DAY_START_HOUR * 60 * 60 * 1000,
  );
  return `${shifted.getFullYear()}-${shifted.getMonth() + 1}-${shifted.getDate()}`;
}

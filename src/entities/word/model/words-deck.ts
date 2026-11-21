import deck from '../../../../data/english-words/english-words.json';
import type { Word } from './word';

type DeckEntry = (typeof deck)[number];

const toWord = (entry: DeckEntry): Word => ({
  rank: entry.rank,
  word: entry.word,
  transcription: entry.transcription,
  translation: entry.translation,
  forms: entry.forms ?? undefined,
  collocations: entry.collocations,
  example: entry.example,
  exampleTranslation: entry.exampleTranslation,
});

/**
 * ВРЕМЕННО: вся колода из `data/english-words` (2690 слов по частотности,
 * без служебных, с транскрипцией, формами и сочетаниями) зашита в приложение, пока словаря нет на сервере (п. 37 в
 * `Идеи.md`). Когда сервер начнёт отдавать слова в порции, файл уходит.
 */
export const WORDS: readonly Word[] = deck.map(toWord);

const BY_RANK = new Map(WORDS.map((word) => [word.rank, word]));

/** Слово по номеру; нет такого — null. */
export const getWord = (rank: number) => BY_RANK.get(rank) ?? null;

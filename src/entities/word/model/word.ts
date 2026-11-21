/**
 * Слово из частотного словаря: `rank` — номер в колоде (1 — самое частое;
 * служебных слов в колоде нет),
 * пример — короткое предложение, по возможности из уже пройденных слов.
 */
export interface WordCollocation {
  en: string;
  ru: string;
}

export interface Word {
  rank: number;
  word: string;
  /** Произношение в американской норме, IPA без косых черт: `ɡoʊ`. */
  transcription: string;
  /** Перевод на русский. */
  translation: string;
  /** Формы, которые не выводятся по правилам: `went, gone`. */
  forms?: string;
  /** Типичные сочетания с переводом: `make a decision — принять решение`. */
  collocations: readonly WordCollocation[];
  example: string;
  /** Перевод примера на русский. */
  exampleTranslation: string;
}

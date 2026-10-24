/** Языки интерфейса. Название — на самом языке, его не переводим. */
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
] as const;

export type Language = (typeof LANGUAGES)[number]['code'];

export const DEFAULT_LANGUAGE: Language = 'en';

export const isLanguage = (value: unknown): value is Language =>
  LANGUAGES.some(({ code }) => code === value);

export const getLanguageLabel = (code: Language) =>
  LANGUAGES.find((language) => language.code === code)?.label ?? code;

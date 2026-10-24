import { createInstance } from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { en } from './locales/en';
import { ru } from './locales/ru';
import { DEFAULT_LANGUAGE, isLanguage, type Language } from './languages';
import { loadLanguage, saveLanguage } from './storage';

export const resources = {
  en: { translation: en },
  ru: { translation: ru },
} as const;

/** Выбранный язык, иначе язык телефона, если мы его знаем, иначе английский. */
function detectLanguage(): Language {
  const saved = loadLanguage();
  if (saved) return saved;
  const device = getLocales()[0]?.languageCode;
  return isLanguage(device) ? device : DEFAULT_LANGUAGE;
}

export const i18n = createInstance();

// Словари лежат в бандле, поэтому инициализация синхронная: первый же рендер
// уже на нужном языке.
i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  initAsync: false,
  interpolation: { escapeValue: false },
});

/** Меняет язык интерфейса и запоминает выбор. */
export function setLanguage(language: Language) {
  saveLanguage(language);
  void i18n.changeLanguage(language);
}

/** Текущий язык; компонент перерисуется при смене. */
export function useLanguage(): Language {
  const { i18n: instance } = useTranslation();
  return isLanguage(instance.language) ? instance.language : DEFAULT_LANGUAGE;
}

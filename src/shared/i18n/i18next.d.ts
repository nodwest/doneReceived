import 'i18next';
import type { en } from './locales/en';

// Ключи для t() берутся из английского словаря: опечатка в ключе — ошибка tsc.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof en };
  }
}

import { createMMKV } from 'react-native-mmkv';
import { isLanguage, type Language } from './languages';

// На вебе MMKV пишет в localStorage.
const storage = createMMKV({ id: 'settings' });
const KEY = 'language';

/** Язык, который пользователь выбрал сам; `undefined` — ещё не выбирал. */
export function loadLanguage(): Language | undefined {
  const value = storage.getString(KEY);
  return isLanguage(value) ? value : undefined;
}

export function saveLanguage(language: Language) {
  storage.set(KEY, language);
}

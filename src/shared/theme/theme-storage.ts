import { createMMKV } from 'react-native-mmkv';
import type { ThemeMode } from './colors';

// Отдельное хранилище от языкового: настройки устройства не должны мешать
// друг другу. На вебе MMKV пишет в localStorage.
const storage = createMMKV({ id: 'theme-settings' });
const KEY = 'mode';

/** Выбранная тема; неизвестное значение — светлая. */
export function loadStoredTheme(): ThemeMode {
  return storage.getString(KEY) === 'dark' ? 'dark' : 'light';
}

export function saveStoredTheme(mode: ThemeMode) {
  storage.set(KEY, mode);
}

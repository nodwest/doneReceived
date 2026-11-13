import { createMMKV } from 'react-native-mmkv';

// На вебе MMKV пишет в localStorage.
const storage = createMMKV({ id: 'installation' });
const KEY = 'installationId';

/** Случайный UUID v4: id установки не секрет, криптостойкость не нужна. */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16);
  });
}

/**
 * Id этой установки приложения: создаётся один раз и хранится на устройстве.
 * Сервер по нему узнаёт повторное подключение ребёнка и заменяет старое
 * устройство, а не добавляет дубль.
 */
export function installationId() {
  const saved = storage.getString(KEY);
  if (saved) return saved;
  const created = uuid();
  storage.set(KEY, created);
  return created;
}

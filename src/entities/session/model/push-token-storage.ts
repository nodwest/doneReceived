import { createMMKV } from 'react-native-mmkv';

// На вебе MMKV пишет в localStorage. Push-токен — не секрет, поэтому
// SecureStore не нужен: он дороже и ограничен по размеру.
const storage = createMMKV({ id: 'push-notifications' });

const TOKEN_KEY = 'token';
const USER_KEY = 'userId';
const ASKED_KEY = 'permissionAsked';
const PENDING_KEY = 'pendingRemoval';

/** Последний зарегистрированный на сервере токен. */
export function savedPushToken() {
  return storage.getString(TOKEN_KEY) ?? null;
}

/** Аккаунт, за которым токен закреплён: при смене аккаунта регистрируем заново. */
export function savedPushTokenUserId() {
  return storage.getString(USER_KEY) ?? null;
}

export function savePushToken(token: string, userId: string) {
  storage.set(TOKEN_KEY, token);
  storage.set(USER_KEY, userId);
}

export function clearSavedPushToken() {
  storage.remove(TOKEN_KEY);
  storage.remove(USER_KEY);
}

/** Спрашивали ли разрешение: повторно не назойничаем каждый запуск. */
export function pushPermissionAsked() {
  return storage.getBoolean(ASKED_KEY) === true;
}

export function markPushPermissionAsked() {
  storage.set(ASKED_KEY, true);
}

/**
 * Токены, которые не удалось снять при выходе. Повторяем при следующем
 * входе: DELETE идемпотентен, лишний вызов безопасен.
 */
export function pendingPushRemovals(): string[] {
  const raw = storage.getString(PENDING_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function writePendingRemovals(tokens: string[]) {
  if (tokens.length) storage.set(PENDING_KEY, JSON.stringify(tokens));
  else storage.remove(PENDING_KEY);
}

export function addPendingPushRemoval(token: string) {
  const tokens = pendingPushRemovals();
  if (!tokens.includes(token)) writePendingRemovals([...tokens, token]);
}

export function removePendingPushRemoval(token: string) {
  writePendingRemovals(pendingPushRemovals().filter((item) => item !== token));
}

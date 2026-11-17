import * as SecureStore from 'expo-secure-store';
import { createMMKV } from 'react-native-mmkv';
import { parseSession, SESSION_KEY } from './session-storage-shared';
import type { Session } from './session';

/**
 * Эпоха хранилища не секрет: она защищает от поздней записи refresh-сессии
 * после выхода или смены аккаунта, в том числе из другого JS-runtime.
 */
const epochStorage = createMMKV({ id: 'session' });
const EPOCH_KEY = 'storage-epoch';

export function sessionEpoch(): number {
  const value = epochStorage.getNumber(EPOCH_KEY);
  return value && Number.isSafeInteger(value) && value > 0 ? value : 1;
}

export function bumpSessionEpoch(): number {
  const next = sessionEpoch() + 1;
  epochStorage.set(EPOCH_KEY, next);
  return next;
}

let pendingLock = Promise.resolve();

/** Один писатель в пределах текущего JS-runtime. */
export function withSessionLock<T>(work: () => Promise<T>): Promise<T> {
  const result = pendingLock.then(work, work);
  pendingLock = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

export async function readSessionForRefresh(
  current: Session,
): Promise<Session | null> {
  let raw: string | null = null;
  try {
    raw = await SecureStore.getItemAsync(SESSION_KEY);
  } catch {
    // Keychain недоступен (например, старый item с WHEN_UNLOCKED на
    // заблокированном iPhone). Не считаем это отзывом сессии.
    return current;
  }
  const saved = parseSession(raw);
  if (!saved || saved.user.id !== current.user.id) return null;
  if (saved.storageEpoch !== undefined && saved.storageEpoch !== sessionEpoch())
    return null;
  return saved.refreshToken === current.refreshToken ? current : saved;
}

let pendingWrite = Promise.resolve();

function writeSession(write: () => Promise<void>): Promise<void> {
  const result = pendingWrite.then(write);
  pendingWrite = result.catch(() => {});
  return result;
}

// На телефоне сессия лежит в зашифрованном хранилище (Keychain / Keystore).
// В вебе Metro берёт session-storage.web.ts.
//
// AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY нужен headless-задаче геолокации:
// заблокированный iPhone должен прочитать токен, но копия не должна
// переезжать на другое устройство или в резервную копию.

export async function loadSession(): Promise<Session | null> {
  let raw: string | null = null;
  try {
    raw = await SecureStore.getItemAsync(SESSION_KEY);
  } catch {
    return null;
  }
  const session = parseSession(raw);
  if (!session) return null;
  const epoch = sessionEpoch();
  if (session.storageEpoch !== undefined && session.storageEpoch !== epoch) {
    await removeSession();
    return null;
  }
  if (session.storageEpoch === undefined) {
    // Сессия старой установки: привязываем к текущей эпохе и заодно
    // перезаписываем с доступностью AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY.
    const migrated = { ...session, storageEpoch: epoch };
    try {
      await saveSession(migrated);
    } catch {
      // Чтение уже удалось; сессию не теряем, миграцию повторим позже.
    }
    return migrated;
  }
  return session;
}

export async function saveSession(session: Session): Promise<void> {
  const stored = {
    ...session,
    storageEpoch: session.storageEpoch ?? sessionEpoch(),
  };
  await writeSession(() =>
    SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(stored), {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    }),
  );
}

export async function removeSession(): Promise<void> {
  await writeSession(() => SecureStore.deleteItemAsync(SESSION_KEY));
}

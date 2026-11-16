import * as SecureStore from 'expo-secure-store';
import { parseSession, SESSION_KEY } from './session-storage-shared';
import type { Session } from './session';

export function withSessionLock<T>(work: () => Promise<T>): Promise<T> {
  return work();
}

export async function readSessionForRefresh(
  current: Session,
): Promise<Session> {
  return current;
}

let pendingWrite = Promise.resolve();

function writeSession(write: () => Promise<void>): Promise<void> {
  const result = pendingWrite.then(write);
  pendingWrite = result.catch(() => {});
  return result;
}

// На телефоне сессия лежит в зашифрованном хранилище (Keychain / Keystore).
// В вебе Metro берёт session-storage.web.ts.

export async function loadSession(): Promise<Session | null> {
  return parseSession(await SecureStore.getItemAsync(SESSION_KEY));
}

export async function saveSession(session: Session): Promise<void> {
  await writeSession(() =>
    SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session)),
  );
}

export async function removeSession(): Promise<void> {
  await writeSession(() => SecureStore.deleteItemAsync(SESSION_KEY));
}

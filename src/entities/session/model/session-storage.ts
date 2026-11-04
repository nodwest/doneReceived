import * as SecureStore from 'expo-secure-store';
import { parseSession, SESSION_KEY } from './session-storage-shared';
import type { Session } from './session';

// На телефоне сессия лежит в зашифрованном хранилище (Keychain / Keystore).
// В вебе Metro берёт session-storage.web.ts.

export async function loadSession(): Promise<Session | null> {
  return parseSession(await SecureStore.getItemAsync(SESSION_KEY));
}

export async function saveSession(session: Session): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function removeSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

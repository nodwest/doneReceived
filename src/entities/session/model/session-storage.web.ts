import { parseSession, SESSION_KEY } from './session-storage-shared';
import type { Session } from './session';

// В вебе secure-store не работает: сессия лежит в localStorage. Доступ к
// нему может бросить исключение (приватный режим, запрет сайта) — тогда
// сессия живёт только до перезагрузки.

export async function loadSession(): Promise<Session | null> {
  try {
    return parseSession(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export async function saveSession(session: Session): Promise<void> {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
}

export async function removeSession(): Promise<void> {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

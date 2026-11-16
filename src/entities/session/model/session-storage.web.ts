import { parseSession, SESSION_KEY } from './session-storage-shared';
import type { Session } from './session';

export function withSessionLock<T>(work: () => Promise<T>): Promise<T> {
  if (typeof navigator === 'undefined' || !navigator.locks) return work();
  return navigator.locks.request('donereceived:session', work);
}

function sessionId(token: string): unknown {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).sid;
  } catch {
    return null;
  }
}

export async function readSessionForRefresh(
  current: Session,
): Promise<Session | null> {
  const saved = parseSession(localStorage.getItem(SESSION_KEY));
  if (!saved || saved.user.id !== current.user.id) return null;
  if (saved.refreshToken === current.refreshToken) return current;

  // JWT claims here are only a local equality check. The API verifies the token.
  const id = sessionId(current.accessToken);
  return typeof id === 'string' && id && id === sessionId(saved.accessToken)
    ? saved
    : null;
}

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
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function removeSession(): Promise<void> {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

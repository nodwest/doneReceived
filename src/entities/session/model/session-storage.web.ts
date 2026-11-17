import { parseSession, SESSION_KEY } from './session-storage-shared';
import type { Session } from './session';

const EPOCH_KEY = 'donereceived:session-epoch';

export function sessionEpoch(): number {
  try {
    const value = Number(localStorage.getItem(EPOCH_KEY));
    return Number.isSafeInteger(value) && value > 0 ? value : 1;
  } catch {
    return 1;
  }
}

export function bumpSessionEpoch(): number {
  const next = sessionEpoch() + 1;
  try {
    localStorage.setItem(EPOCH_KEY, String(next));
  } catch {
    // Приватный режим: сессия и так живёт только до перезагрузки.
  }
  return next;
}

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
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(SESSION_KEY);
  } catch {
    return current;
  }
  const saved = parseSession(raw);
  if (!saved || saved.user.id !== current.user.id) return null;
  if (saved.storageEpoch !== undefined && saved.storageEpoch !== sessionEpoch())
    return null;
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
    const session = parseSession(localStorage.getItem(SESSION_KEY));
    if (!session) return null;
    const epoch = sessionEpoch();
    if (session.storageEpoch !== undefined && session.storageEpoch !== epoch) {
      await removeSession();
      return null;
    }
    if (session.storageEpoch === undefined) {
      const migrated = { ...session, storageEpoch: epoch };
      await saveSession(migrated);
      return migrated;
    }
    return session;
  } catch {
    return null;
  }
}

export async function saveSession(session: Session): Promise<void> {
  const stored = {
    ...session,
    storageEpoch: session.storageEpoch ?? sessionEpoch(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(stored));
}

export async function removeSession(): Promise<void> {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

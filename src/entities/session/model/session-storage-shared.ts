import type { Session } from './session';

/** Ключ сессии в хранилище. */
export const SESSION_KEY = 'session';

/** Сессия из сохранённой строки; битая или неполная — null. */
export function parseSession(raw: string | null): Session | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<Session>;
    if (!data.accessToken || !data.refreshToken || !data.user?.id) return null;
    return data as Session;
  } catch {
    return null;
  }
}

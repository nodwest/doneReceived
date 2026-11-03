import { create } from 'zustand';
import { setAccessTokenGetter } from '@shared/api';
import type { Session } from './session';
import { loadSession, removeSession, saveSession } from './session-storage';

/**
 * restoring — читаем сохранённую сессию при запуске; signed-out — входа нет;
 * signed-in — есть токены и пользователь.
 */
export type SessionStatus = 'restoring' | 'signed-out' | 'signed-in';

type SessionState = {
  status: SessionStatus;
  session: Session | null;
  /** Поднять сохранённую сессию: один раз при запуске приложения. */
  restore: () => Promise<void>;
  /** Запомнить сессию после логина. */
  signIn: (session: Session) => Promise<void>;
  /** Забыть сессию: выход из аккаунта. */
  signOut: () => Promise<void>;
};

export const useSessionStore = create<SessionState>((set, get) => ({
  status: 'restoring',
  session: null,
  restore: async () => {
    const session = await loadSession();
    // Пока читали хранилище, могли успеть войти — не затираем.
    if (get().status !== 'restoring') return;
    set({ session, status: session ? 'signed-in' : 'signed-out' });
  },
  signIn: async (session) => {
    set({ session, status: 'signed-in' });
    await saveSession(session);
  },
  signOut: async () => {
    set({ session: null, status: 'signed-out' });
    await removeSession();
  },
}));

// Запросы к API берут токен из текущей сессии.
setAccessTokenGetter(
  () => useSessionStore.getState().session?.accessToken ?? null,
);

export const useSession = () => useSessionStore((state) => state.session);

/** Вошедший пользователь или null. */
export const useSessionUser = () =>
  useSessionStore((state) => state.session?.user ?? null);

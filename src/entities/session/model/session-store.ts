import { create } from 'zustand';
import {
  isApiError,
  setAccessTokenGetter,
  setTokenRefresher,
} from '@shared/api';
import { refreshSession } from '../api/auth-api';
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
  /**
   * Обновить токены по refresh-токену. true — новая пара сохранена. Сервер
   * не принял refresh-токен (401 или 400) — сессия стирается, экраны уводят на
   * логин. Нет сети — сессия остаётся, false.
   */
  refresh: () => Promise<boolean>;
};

const log = (message: string) => {
  if (__DEV__) console.log(`[auth] ${message}`);
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
  refresh: async () => {
    const current = get().session;
    if (!current) return false;
    try {
      const next = await refreshSession(current.refreshToken);
      // Пока обновляли, вышли или вошли заново — эту сессию не воскрешаем.
      if (get().session !== current) return get().session !== null;
      // Ответ refresh не знает id детского профиля — берём из прежней сессии.
      await get().signIn({ ...next, childId: current.childId });
      log('Токены обновлены');
      return true;
    } catch (error) {
      // 401 — refresh-токен отозван или истёк, 400 — сохранён битым.
      if (isApiError(error) && (error.status === 401 || error.status === 400)) {
        if (get().session === current) await get().signOut();
        log('Сессия истекла, нужно войти заново');
      }
      return false;
    }
  },
}));

// Запросы к API берут токен из текущей сессии.
setAccessTokenGetter(
  () => useSessionStore.getState().session?.accessToken ?? null,
);
// Токен устарел — запрос сам обновит его и повторится.
setTokenRefresher(() => useSessionStore.getState().refresh());

export const useSession = () => useSessionStore((state) => state.session);

/** Вошедший пользователь или null. */
export const useSessionUser = () =>
  useSessionStore((state) => state.session?.user ?? null);

/**
 * id аккаунта вошедшего (`user.id`); без входа — пустая строка. По нему
 * экраны узнают «свои» задания, награды и карточку «You».
 */
export const useMyId = () =>
  useSessionStore((state) => state.session?.user.id ?? '');

/** Родитель или ребёнок вошёл; без поля в сессии (старая) — родитель. */
export const useSessionKind = () =>
  useSessionStore((state) =>
    state.session ? (state.session.user.kind ?? 'parent') : null,
  );

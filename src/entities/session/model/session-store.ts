import { create } from 'zustand';
import {
  isApiError,
  setAccessTokenGetter,
  setTokenRefresher,
} from '@shared/api';
import { refreshSession } from '../api/auth-api';
import type { Session } from './session';
import {
  loadSession,
  readSessionForRefresh,
  removeSession,
  saveSession,
  withSessionLock,
} from './session-storage';

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
   * Обновить токены по refresh-токену. true — новая пара доступна. Сервер
   * не принял refresh-токен (401 или 400) — сессия стирается, экраны уводят на
   * логин. Нет сети — сессия остаётся, false.
   */
  refresh: () => Promise<boolean>;
};

const log = (message: string) => {
  if (__DEV__) console.log(`[auth] ${message}`);
};

let sessionScope = Symbol();
let pendingSave: { previous: Session; next: Session } | undefined;

async function persistRefresh(previous: Session, next: Session) {
  pendingSave = { previous, next };
  try {
    await saveSession(next);
    if (pendingSave?.next === next) pendingSave = undefined;
  } catch {
    log('Не удалось сохранить обновлённую сессию');
  }
}

export const useSessionStore = create<SessionState>((set, get) => ({
  status: 'restoring',
  session: null,
  restore: async () => {
    const session = await loadSession();
    // Пока читали хранилище, могли успеть войти — не затираем.
    if (get().status !== 'restoring') return;
    set({ session, status: session ? 'signed-in' : 'signed-out' });
  },
  signIn: (session) =>
    withSessionLock(async () => {
      sessionScope = Symbol();
      set({ session, status: 'signed-in' });
      pendingSave = undefined;
      try {
        await saveSession(session);
      } catch {
        log('Не удалось сохранить сессию');
      }
    }),
  signOut: () => {
    const current = get().session;
    const signedOutScope = (sessionScope = Symbol());
    pendingSave = undefined;
    set({ session: null, status: 'signed-out' });
    return withSessionLock(async () => {
      if (
        current &&
        (await readSessionForRefresh(current)) &&
        sessionScope === signedOutScope
      ) {
        await removeSession();
      }
    }).catch(() => log('Не удалось удалить сохранённую сессию'));
  },
  refresh: async () => {
    const current = get().session;
    if (!current) return false;
    return withSessionLock(async () => {
      if (get().session !== current) return false;
      const saved = await readSessionForRefresh(current);
      if (get().session !== current) return false;
      if (!saved) {
        sessionScope = Symbol();
        set({ session: null, status: 'signed-out' });
        return false;
      }
      if (
        pendingSave?.next === current &&
        (saved === current ||
          saved.refreshToken === pendingSave.previous.refreshToken)
      ) {
        await persistRefresh(saved, current);
        if (get().session !== current || pendingSave?.next === current)
          return false;
      } else if (saved !== current) {
        pendingSave = undefined;
        set({ session: saved });
        return true;
      }

      let next: Session;
      try {
        next = await refreshSession(current.refreshToken);
      } catch (error) {
        if (
          get().session === current &&
          isApiError(error) &&
          (error.status === 401 || error.status === 400)
        ) {
          sessionScope = Symbol();
          pendingSave = undefined;
          set({ session: null, status: 'signed-out' });
          await removeSession();
          log('Сессия истекла, нужно войти заново');
        }
        return false;
      }
      if (get().session !== current) return false;
      const session = { ...next, childId: current.childId };
      set({ session });
      await persistRefresh(current, session);
      return true;
    }).catch(() => false);
  },
}));

// Запросы к API берут токен из текущей сессии.
setAccessTokenGetter(
  () => useSessionStore.getState().session?.accessToken ?? null,
  () => sessionScope,
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

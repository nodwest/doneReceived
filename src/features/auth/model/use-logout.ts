import { useQueryClient } from '@tanstack/react-query';
import {
  forgetPushTokenForSignOut,
  logout,
  useSessionStore,
} from '@entities/session';
import { authLog } from './auth-log';

/**
 * Выход: просим сервер отозвать refresh-токен и, не дожидаясь ответа,
 * забываем сессию и кэш запросов — выйти можно и без сети. Так же выходит
 * и ребёнок со своей сессией.
 */
export function useLogout() {
  const signOut = useSessionStore((state) => state.signOut);
  const queryClient = useQueryClient();
  return async () => {
    const session = useSessionStore.getState().session;
    // Push-токен снимаем до очистки сессии: запрос уже несёт access-токен,
    // а если сети нет — он повторится при следующем входе.
    forgetPushTokenForSignOut();
    if (session) {
      logout(session.refreshToken)
        .then(() => authLog('Сервер завершил сессию'))
        .catch(() =>
          authLog('Сервер не ответил на выход, сессия стёрта только здесь'),
        );
    }
    await signOut();
    queryClient.clear();
    authLog('Вы вышли', { email: session?.user.email });
  };
}

import { useQueryClient } from '@tanstack/react-query';
import { logout, useSessionStore } from '@entities/session';
import { useViewerRoleStore } from '@entities/user';
import { authLog } from './auth-log';

/**
 * Выход: просим сервер отозвать refresh-токен и, не дожидаясь ответа,
 * забываем сессию и кэш запросов — выйти можно и без сети. Ребёнок,
 * вошедший по коду без аккаунта, тоже выходит.
 */
export function useLogout() {
  const signOut = useSessionStore((state) => state.signOut);
  const leaveChild = useViewerRoleStore((state) => state.leaveChild);
  const queryClient = useQueryClient();
  return async () => {
    const session = useSessionStore.getState().session;
    if (session) {
      logout(session.refreshToken)
        .then(() => authLog('Сервер завершил сессию'))
        .catch(() =>
          authLog('Сервер не ответил на выход, сессия стёрта только здесь'),
        );
    }
    leaveChild();
    await signOut();
    queryClient.clear();
    authLog('Вы вышли', { email: session?.user.email });
  };
}

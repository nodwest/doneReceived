import { useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@entities/session';

/**
 * Выход: забываем токены и кэш запросов. Ручки выхода у API пока нет —
 * сервер про выход не узнаёт, токен просто перестаёт уходить в запросах.
 */
export function useLogout() {
  const signOut = useSessionStore((state) => state.signOut);
  const queryClient = useQueryClient();
  return async () => {
    await signOut();
    queryClient.clear();
  };
}

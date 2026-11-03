import { useMutation } from '@tanstack/react-query';
import { login, useSessionStore } from '@entities/session';
import { useViewerRoleStore } from '@entities/user';

/**
 * Вход родителя: сохраняет сессию и переключает приложение на экраны
 * родителя (временная роль просмотра стартует с ребёнка).
 */
export function useLogin() {
  const signIn = useSessionStore((state) => state.signIn);
  const setRole = useViewerRoleStore((state) => state.setRole);
  return useMutation({
    mutationFn: login,
    onSuccess: async (session) => {
      await signIn(session);
      setRole('parent');
    },
  });
}

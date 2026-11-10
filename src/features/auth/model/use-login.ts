import { useMutation } from '@tanstack/react-query';
import { login, useSessionStore } from '@entities/session';
import { useViewerRoleStore } from '@entities/user';
import { authLog } from './auth-log';
import { forgetSignUp } from './sign-up-credentials';

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
      forgetSignUp();
      setRole(session.user.kind ?? 'parent');
      await signIn(session);
      authLog('Вы вошли', { id: session.user.id, email: session.user.email });
    },
  });
}

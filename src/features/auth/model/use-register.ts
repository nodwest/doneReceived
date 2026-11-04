import { useMutation } from '@tanstack/react-query';
import { register } from '@entities/session';
import { authLog } from './auth-log';
import { rememberSignUp } from './sign-up-credentials';

/**
 * Регистрация родителя: после успеха сервер шлёт письмо с кодом, а почта и
 * пароль запоминаются, чтобы войти сразу после подтверждения.
 */
export function useRegister() {
  return useMutation({
    mutationFn: register,
    onSuccess: (_, { email, password }) => {
      rememberSignUp({ email, password });
      authLog('Вы зарегистрировались, письмо с кодом отправлено', { email });
    },
  });
}

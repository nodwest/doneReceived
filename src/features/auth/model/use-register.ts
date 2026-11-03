import { useMutation } from '@tanstack/react-query';
import { register } from '@entities/session';

/** Регистрация родителя: после успеха сервер шлёт письмо с кодом. */
export function useRegister() {
  return useMutation({ mutationFn: register });
}

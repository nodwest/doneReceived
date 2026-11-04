import { useMutation } from '@tanstack/react-query';
import { resendVerification, verifyEmail } from '@entities/session';
import { authLog } from './auth-log';

/** Подтверждение почты кодом из письма. */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (_, { email }) => authLog('Почта подтверждена', { email }),
  });
}

/** Повторная отправка письма с кодом. */
export function useResendVerification() {
  return useMutation({
    mutationFn: resendVerification,
    onSuccess: (_, email) =>
      authLog('Письмо с кодом отправлено ещё раз', { email }),
  });
}

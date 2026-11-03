import { useMutation } from '@tanstack/react-query';
import { resendVerification, verifyEmail } from '@entities/session';

/** Подтверждение почты кодом из письма. */
export function useVerifyEmail() {
  return useMutation({ mutationFn: verifyEmail });
}

/** Повторная отправка письма с кодом. */
export function useResendVerification() {
  return useMutation({ mutationFn: resendVerification });
}

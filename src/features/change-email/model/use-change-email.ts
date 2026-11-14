import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  confirmEmailChange,
  fetchMe,
  meKeys,
  requestEmailChange,
  resendEmailChange,
  type SessionUser,
} from '@entities/session';
import { syncData } from '@shared/api';

/**
 * Запросить смену почты (POST /users/me/email): новый адрес сразу пишется в
 * кэш профиля как ожидающий — экран переходит к вводу кода, Edit profile
 * показывает, что почта ждёт подтверждения. Сам не повторяется: неверный
 * пароль сервер считает в общем лимите со сменой пароля.
 */
export function useRequestEmailChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestEmailChange,
    retry: false,
    onSuccess: (_, { newEmail }) => {
      queryClient.setQueryData<SessionUser>(meKeys.all, (me) =>
        me ? { ...me, pendingEmail: newEmail.trim().toLowerCase() } : me,
      );
      syncData(queryClient, 'email-changed');
    },
  });
}

/**
 * Подтвердить новую почту кодом (POST /users/me/email/confirm): профиль с
 * новой почтой — сразу в кэш. Сам не повторяется: код одноразовый, у
 * неверных — лимит попыток.
 */
export function useConfirmEmailChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmEmailChange,
    retry: false,
    onSuccess: (user) => {
      queryClient.setQueryData(meKeys.all, user);
      syncData(queryClient, 'email-changed');
    },
  });
}

/** Письмо со сменой почты ещё раз (POST /users/me/email/resend). */
export function useResendEmailChange() {
  return useMutation({ mutationFn: resendEmailChange, retry: false });
}

/**
 * «I confirmed via the link»: ссылка подтверждает почту в браузере, без
 * приложения, — перечитываем профиль (GET /users/me) и кладём в кэш.
 * Страница по ответу решает, сменилась ли почта.
 */
export function useCheckEmailChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetchMe,
    onSuccess: (user) => queryClient.setQueryData(meKeys.all, user),
  });
}

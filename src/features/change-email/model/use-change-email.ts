import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

/** Как часто проверять профиль, пока ждём подтверждения новой почты. */
export const EMAIL_CHANGE_CHECK_MS = 5_000;

/**
 * Пока ждём подтверждения: ссылка из письма подтверждает почту в браузере,
 * без приложения, и, возможно, на другом устройстве, — поэтому профиль
 * (GET /users/me) перечитывается каждые 5 с и при возврате в приложение.
 * Страница видит в кэше, что `pendingEmail` пропал, и сама решает, сменилась
 * ли почта. `refetch` — проверить сразу.
 */
export function useEmailChangeWatch() {
  return useQuery({
    queryKey: meKeys.all,
    queryFn: fetchMe,
    refetchInterval: EMAIL_CHANGE_CHECK_MS,
    staleTime: 0,
  });
}

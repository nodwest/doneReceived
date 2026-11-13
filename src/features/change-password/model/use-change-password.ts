import { useMutation } from '@tanstack/react-query';
import { changePassword } from '@entities/session';

/**
 * Смена пароля родителя (POST /users/me/password). Сам не повторяется:
 * сервер считает каждую попытку (лимит на аккаунт и IP). Текущая сессия
 * остаётся, другие устройства сервер разлогинивает.
 */
export function useChangePassword() {
  return useMutation({ mutationFn: changePassword, retry: false });
}

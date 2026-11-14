import { hasApiErrorCode, isApiError } from '@shared/api';

/** Ошибка смены пароля — ключ в `changePassword.errors`. */
export type ChangePasswordError =
  | 'wrongCurrent'
  | 'sameAsCurrent'
  | 'tooManyAttempts'
  | 'network'
  | 'failed';

/** Где показать ошибку: под полем текущего или нового пароля, иначе тостом. */
export type ChangePasswordErrorInfo = {
  error: ChangePasswordError;
  field: 'currentPassword' | 'newPassword' | null;
  /** У 429 — через сколько минут можно снова. */
  minutes: number;
};

/** Что показать по ошибке POST /users/me/password. */
export function changePasswordError(error: unknown): ChangePasswordErrorInfo {
  const info = (
    value: ChangePasswordError,
    field: ChangePasswordErrorInfo['field'] = null,
    minutes = 0,
  ): ChangePasswordErrorInfo => ({ error: value, field, minutes });
  if (!isApiError(error)) return info('failed');
  if (error.status === 0) return info('network');
  if (error.status === 429) {
    return info(
      'tooManyAttempts',
      null,
      Math.max(1, Math.ceil((error.retryAfter ?? 60) / 60)),
    );
  }
  if (hasApiErrorCode(error, 'INVALID_CURRENT_PASSWORD')) {
    return info('wrongCurrent', 'currentPassword');
  }
  if (hasApiErrorCode(error, 'PASSWORD_SAME_AS_CURRENT')) {
    return info('sameAsCurrent', 'newPassword');
  }
  return info('failed');
}

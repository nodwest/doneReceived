import { hasApiErrorCode, isApiError } from '@shared/api';

/** Ошибка смены почты — ключ в `changeEmail.errors`. */
export type ChangeEmailError =
  | 'emailInvalid'
  | 'wrongPassword'
  | 'sameAsCurrent'
  | 'emailTaken'
  | 'wrongCode'
  | 'codeExpired'
  | 'noPending'
  | 'tooManyAttempts'
  | 'network'
  | 'failed';

/**
 * Что показать: ключ ошибки и где — под полем новой почты, пароля или кода,
 * иначе тостом. `count` — минуты до новой попытки (429) или сколько неверных
 * кодов ещё можно (`wrongCode`, null — сервер не прислал).
 */
export type ChangeEmailErrorInfo = {
  error: ChangeEmailError;
  field: 'newEmail' | 'password' | 'code' | null;
  count: number | null;
};

const info = (
  error: ChangeEmailError,
  field: ChangeEmailErrorInfo['field'] = null,
  count: number | null = null,
): ChangeEmailErrorInfo => ({ error, field, count });

/** Общее для всех ручек смены почты: сеть, 429, адрес занят. */
function commonError(error: unknown): ChangeEmailErrorInfo | null {
  if (!isApiError(error)) return info('failed');
  if (error.status === 0) return info('network');
  if (error.status === 429) {
    const minutes = Math.max(1, Math.ceil((error.retryAfter ?? 60) / 60));
    return info('tooManyAttempts', null, minutes);
  }
  if (error.status === 409 || hasApiErrorCode(error, 'EMAIL_TAKEN')) {
    return info('emailTaken', 'newEmail');
  }
  return null;
}

/** Что показать по ошибке POST /users/me/email. */
export function requestEmailChangeError(error: unknown): ChangeEmailErrorInfo {
  const common = commonError(error);
  if (common || !isApiError(error)) return common ?? info('failed');
  if (hasApiErrorCode(error, 'INVALID_CURRENT_PASSWORD')) {
    return info('wrongPassword', 'password');
  }
  if (hasApiErrorCode(error, 'EMAIL_SAME_AS_CURRENT')) {
    return info('sameAsCurrent', 'newEmail');
  }
  // Остальные 400 — сервер не принял адрес.
  if (error.status === 400) return info('emailInvalid', 'newEmail');
  return info('failed');
}

/** `attemptsLeft` из тела ошибки: сколько неверных кодов ещё можно. */
function attemptsLeft(data: unknown): number | null {
  if (!data || typeof data !== 'object' || !('attemptsLeft' in data)) {
    return null;
  }
  const value = (data as { attemptsLeft: unknown }).attemptsLeft;
  return typeof value === 'number' ? value : null;
}

/**
 * Что показать по ошибке POST /users/me/email/confirm и …/resend. Неверный
 * код — сколько попыток осталось (`attemptsLeft`), всегда.
 */
export function confirmEmailChangeError(error: unknown): ChangeEmailErrorInfo {
  const common = commonError(error);
  if (common || !isApiError(error)) return common ?? info('failed');
  if (error.status === 404) return info('noPending');
  if (hasApiErrorCode(error, 'CODE_EXPIRED'))
    return info('codeExpired', 'code');
  if (error.status === 400) {
    const left = attemptsLeft(error.data);
    return info('wrongCode', 'code', left);
  }
  return info('failed');
}

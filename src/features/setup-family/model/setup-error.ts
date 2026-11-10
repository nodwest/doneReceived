import { isApiError } from '@shared/api';

/** Ошибка создания или вступления — ключ в `familySetup.errors`. */
export type SetupError =
  | 'network'
  | 'invalidName'
  | 'alreadyInFamily'
  | 'invalidCode'
  | 'cannotJoin'
  | 'unknown';

/**
 * Что показать по ошибке: ключ ошибки или «слишком много попыток» (429) —
 * тогда через сколько минут можно снова.
 */
export type SetupErrorInfo =
  | { kind: 'error'; error: SetupError; attemptsLeft: number | null }
  | { kind: 'tooManyAttempts'; minutes: number };

/** С какого остатка предупреждаем «Осталось N попыток». */
const WARN_ATTEMPTS_LEFT = 3;

/** Лимит неверных кодов считается за 15 минут: без Retry-After — столько. */
const DEFAULT_RETRY_MINUTES = 15;

const plain = (error: SetupError): SetupErrorInfo => ({
  kind: 'error',
  error,
  attemptsLeft: null,
});

/** Что показать по ошибке POST /families. */
export function createFamilyError(error: unknown): SetupErrorInfo {
  if (!isApiError(error)) return plain('unknown');
  if (error.status === 0) return plain('network');
  if (error.status === 400) return plain('invalidName');
  if (error.status === 409) return plain('alreadyInFamily');
  return plain('unknown');
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
 * Что показать по ошибке POST /families/join. Неверный код — сколько
 * попыток осталось, но только когда их мало (3 и меньше): до этого человек
 * про лимит не знает. 429 — лимит исчерпан, через сколько минут можно снова.
 */
export function joinFamilyError(error: unknown): SetupErrorInfo {
  if (!isApiError(error)) return plain('unknown');
  if (error.status === 0) return plain('network');
  if (error.status === 429) {
    const seconds = error.retryAfter ?? DEFAULT_RETRY_MINUTES * 60;
    return {
      kind: 'tooManyAttempts',
      minutes: Math.max(Math.ceil(seconds / 60), 1),
    };
  }
  if (error.status === 400) {
    const left = attemptsLeft(error.data);
    return {
      kind: 'error',
      error: 'invalidCode',
      attemptsLeft: left !== null && left <= WARN_ATTEMPTS_LEFT ? left : null,
    };
  }
  // Аккаунт уже в семье или в семье нет мест: сервер пока не говорит, что
  // именно (просим у бэкенда код ошибки).
  if (error.status === 409) return plain('cannotJoin');
  return plain('unknown');
}

import { isApiError } from '@shared/api';

/** Ошибка запроса — ключ в разделе `auth.requestErrors` словаря. */
export type RequestError =
  | 'network'
  | 'emailTaken'
  | 'wrongCode'
  | 'resendFailed'
  | 'wrongCredentials'
  | 'notConfirmed'
  | 'unknown';

/**
 * Что показать человеку по ошибке запроса. `clientError` — смысл ответа
 * 400 / 401 у этого эндпоинта (у каждого он свой, а текст сервера не
 * переводится).
 */
export function requestError(
  error: unknown,
  clientError: RequestError,
): RequestError {
  if (!isApiError(error)) return 'unknown';
  if (error.status === 0) return 'network';
  if (error.status === 400 || error.status === 401) return clientError;
  return 'unknown';
}

/**
 * Сколько ждём необязательный запрос (имена и аватары участников), прежде чем
 * продолжить без него. Основные данные при этом не ждут вечно чужой ответ.
 */
export const OPTIONAL_REQUEST_TIMEOUT_MS = 5_000;

/**
 * Дождаться Promise не дольше `ms`; не ответил или упал — вернуть `fallback`.
 * Нужен для необязательных подписей: из-за зависшего `/members` не должен
 * зависать весь список заданий или лента.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  fallback: T,
  ms = OPTIONAL_REQUEST_TIMEOUT_MS,
): Promise<T> {
  return new Promise<T>((resolve) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout>;
    const finish = (value: T) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };
    timer = setTimeout(() => finish(fallback), ms);
    promise.then(finish, () => finish(fallback));
  });
}

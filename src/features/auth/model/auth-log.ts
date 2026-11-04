/**
 * Шаги входа в консоль, чтобы видеть путь при разработке: `[auth] …`.
 * Пароли и токены сюда не передавайте.
 */
export function authLog(message: string, details?: Record<string, unknown>) {
  if (!__DEV__) return;
  if (details) console.log(`[auth] ${message}`, details);
  else console.log(`[auth] ${message}`);
}

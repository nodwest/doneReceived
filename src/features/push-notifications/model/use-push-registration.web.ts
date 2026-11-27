/**
 * Веб-сборка: Expo Push на вебе не поддерживается, регистрация токена не
 * нужна. Файл подменяет нативную реализацию, чтобы веб-бандл не тянул
 * `expo-notifications`.
 */
export function usePushRegistration() {}

export async function syncPushRegistration() {
  return false;
}

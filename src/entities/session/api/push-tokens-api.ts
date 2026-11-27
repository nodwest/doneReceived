import { apiRequest } from '@shared/api';

// Эндпоинты push-уведомлений текущего аккаунта.

export type PushPlatform = 'ios' | 'android';

export type RegisterPushTokenPayload = {
  token: string;
  platform: PushPlatform;
  /** Стабильный id установки: по нему сервер отличает смену аккаунта от чужого токена. */
  installationId: string;
  reminderTimePreview?: boolean;
};

/**
 * POST /users/me/push-tokens — закрепить Expo-токен за текущим аккаунтом.
 * Повтор с тем же токеном обновляет платформу без дубля. 409
 * `PUSH_TOKEN_OWNED` — токен закреплён за другой установкой.
 */
export function registerPushToken(payload: RegisterPushTokenPayload) {
  return apiRequest<{ token: string; platform: PushPlatform }>(
    '/users/me/push-tokens',
    { method: 'POST', body: payload },
  );
}

/**
 * DELETE /users/me/push-tokens — снять токен при выходе. Повторное удаление
 * сервер не считает ошибкой. Токены при выходе не обновляем: сессия ещё
 * жива, а ждать сеть в этот момент не нужно.
 */
export function removePushToken(token: string) {
  return apiRequest<null>('/users/me/push-tokens', {
    method: 'DELETE',
    body: { token },
    skipRefresh: true,
    timeoutMs: 4000,
  });
}

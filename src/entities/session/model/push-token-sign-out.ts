import { removePushToken } from '../api/push-tokens-api';
import {
  addPendingPushRemoval,
  clearSavedPushToken,
  removePendingPushRemoval,
  savedPushToken,
} from './push-token-storage';

/**
 * Выход из аккаунта: снять push-токен с сервера. Запрос стартует до очистки
 * сессии, поэтому уже несёт access-токен; ждать сеть не нужно — при обрыве
 * токен останется в списке неотправленных и повторится при следующем входе.
 *
 * Токен снимаем, чтобы вышедший аккаунт не получал уведомления на это
 * устройство. Регистрация нового аккаунта на этой же установке работает
 * через `installationId` и не требует предварительного DELETE.
 */
export function forgetPushTokenForSignOut() {
  const token = savedPushToken();
  if (!token) return;
  addPendingPushRemoval(token);
  clearSavedPushToken();
  void removePushToken(token)
    .then(() => removePendingPushRemoval(token))
    .catch(() => {
      // Сеть недоступна: повторим при следующем входе, DELETE идемпотентен.
    });
}

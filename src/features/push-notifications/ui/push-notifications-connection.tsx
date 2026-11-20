import { useEffect, useRef } from 'react';
import { useRouter, type Href } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useSessionStore } from '@entities/session';
import {
  syncPushRegistration,
  usePushRegistration,
} from '../model/use-push-registration';

const TASK_TYPES = new Set([
  'task_created',
  'task_approved',
  'task_submitted',
  'task_rejected',
]);
const ZONE_TYPES = new Set(['zone_entered', 'zone_exited']);

/**
 * Куда ведёт tap по уведомлению. Экран сам проверяет доступ к данным, поэтому
 * `data` — только подсказка навигации, а не доказательство прав.
 */
function notificationRoute(data: unknown): Href | null {
  if (!data || typeof data !== 'object') return null;
  const { type } = data as { type?: unknown };
  if (typeof type !== 'string') return null;

  if (type === 'family_event_reminder') {
    const { eventId } = data as { eventId?: unknown };
    // Без year сервер отдаст ближайшее наступление — именно то, о котором
    // напомнили; для прошедшего года карточка не нужна.
    return typeof eventId === 'string' && eventId.length > 0
      ? { pathname: '/family-event/[id]', params: { id: eventId } }
      : '/calendar';
  }
  if (TASK_TYPES.has(type)) return '/tasks';
  if (ZONE_TYPES.has(type)) return '/map';
  return null;
}

/**
 * Единая точка входа уведомлений: регистрирует токен и открывает экран по
 * tap. Живёт рядом с провайдерами, поэтому работает на любом экране.
 */
export function PushNotificationsConnection() {
  usePushRegistration();
  const router = useRouter();
  const sessionStatus = useSessionStore((state) => state.status);
  const pending = useRef<Href | null>(null);

  useEffect(() => {
    const open = (response: Notifications.NotificationResponse | null) => {
      if (!response) return;
      const href = notificationRoute(
        response.notification.request.content.data,
      );
      if (!href) return;
      // Без входа экран приложения закрыт: запомним и откроем после restore.
      if (useSessionStore.getState().status === 'signed-in') router.push(href);
      else pending.current = href;
    };

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(open);
    // Приложение могло быть запущено тапом: ответ ждёт первого чтения.
    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      open(response);
      void Notifications.clearLastNotificationResponseAsync();
    });
    // Expo сменил токен установки — регистрируем новый Expo-токен.
    const tokenSubscription = Notifications.addPushTokenListener(() => {
      void syncPushRegistration();
    });

    return () => {
      responseSubscription.remove();
      tokenSubscription.remove();
    };
  }, [router]);

  useEffect(() => {
    if (sessionStatus !== 'signed-in' || !pending.current) return;
    const href = pending.current;
    pending.current = null;
    router.push(href);
  }, [router, sessionStatus]);

  return null;
}

import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import {
  markPushPermissionAsked,
  pendingPushRemovals,
  pushPermissionAsked,
  registerPushToken,
  reminderTimePreviewEnabled,
  removePendingPushRemoval,
  removePushToken,
  savePushToken,
  useMyId,
  useSessionFamilyId,
  useSessionStore,
} from '@entities/session';
import { isApiError } from '@shared/api';
import { i18n } from '@shared/i18n';
import { installationId } from '@shared/lib';

// Напоминание о событии и уведомления о заданиях приходят от Expo Push.
// Токен регистрируется после входа, когда у аккаунта уже есть семья:
// до этого уведомлять не о чем, а лишний системный запрос раздражает.

const CHANNEL_ID = 'default';

/** В консоль, чтобы видеть путь регистрации; токен сюда не попадает. */
function pushLog(message: string, details?: Record<string, unknown>) {
  if (!__DEV__) return;
  if (details) console.log(`[push] ${message}`, details);
  else console.log(`[push] ${message}`);
}

// Android suppresses the foreground banner when shouldPlaySound is false.
Notifications.setNotificationHandler({
  handleNotification: async (notification) => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound:
      Platform.OS === 'android' &&
      notification.request.content.data?.type === 'family_event_reminder',
    shouldSetBadge: false,
  }),
});

/** EAS projectId нужен Expo Push Service; без него токен не выдать. */
function expoProjectId() {
  const extra = Constants.expoConfig?.extra as
    | { eas?: { projectId?: unknown } }
    | undefined;
  const projectId = extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  return typeof projectId === 'string' && projectId.length > 0
    ? projectId
    : null;
}

/**
 * Разрешение и Expo-токен. Просим разрешение один раз: если пользователь
 * отказался, не показываем системный диалог на каждый запуск — он может
 * включить уведомления в настройках сам.
 */
async function requestExpoToken() {
  const projectId = expoProjectId();
  if (!projectId) {
    pushLog('нет extra.eas.projectId: Expo-токен не получить');
    return null;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: i18n.t('push.channelReminders'),
      importance: Notifications.AndroidImportance.DEFAULT,
    }).catch(() => undefined);
  }

  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted' && !pushPermissionAsked()) {
    markPushPermissionAsked();
    ({ status } = await Notifications.requestPermissionsAsync());
  }
  if (status !== 'granted') return null;

  try {
    return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (error) {
    // Текст ошибки нативного модуля в лог не пишем: там может быть projectId.
    pushLog('Expo не выдал токен', {
      error: error instanceof Error ? error.name : 'unknown',
    });
    return null;
  }
}

async function retryPendingRemovals() {
  for (const token of pendingPushRemovals()) {
    try {
      await removePushToken(token);
    } catch {
      return; // Сеть недоступна — повторим при следующем входе.
    }
    removePendingPushRemoval(token);
  }
}

async function syncPushToken(userId: string, isCurrent: () => boolean) {
  const token = await requestExpoToken();
  if (!token || !isCurrent()) return false;
  try {
    await registerPushToken({
      token,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
      installationId: installationId(),
      reminderTimePreview: reminderTimePreviewEnabled(userId),
    });
    if (!isCurrent()) return false;
    savePushToken(token, userId);
    return true;
  } catch (error) {
    // 409 PUSH_TOKEN_OWNED: токен закреплён за другой установкой. Молча не
    // затираем и повторим на следующем запуске.
    pushLog('сервер не принял push-токен', {
      status: isApiError(error) ? error.status : null,
    });
    return false;
  }
}

/**
 * Синхронизация токена с сервером для текущего аккаунта: сначала закрываем
 * неотправленные удаления, затем регистрируем токен этой установки.
 */
let registration = Promise.resolve(false);

export function syncPushRegistration() {
  const session = useSessionStore.getState().session;
  if (!session) return Promise.resolve(false);
  const isCurrent = () => {
    const current = useSessionStore.getState().session;
    return (
      current?.user.id === session.user.id &&
      current.storageEpoch === session.storageEpoch
    );
  };
  registration = registration
    .then(async () => {
      if (!isCurrent()) return false;
      await retryPendingRemovals();
      return isCurrent() && syncPushToken(session.user.id, isCurrent);
    })
    .catch(() => {
      pushLog('не удалось синхронизировать регистрацию');
      return false;
    });
  return registration;
}

/**
 * Регистрирует push-токен после входа (и когда появляется семья), а также
 * обновляет его при возврате в foreground: Expo может выдать новый токен.
 */
export function usePushRegistration() {
  const accessToken = useSessionStore(
    (state) => state.session?.accessToken ?? null,
  );
  const userId = useMyId();
  const familyId = useSessionFamilyId();

  useEffect(() => {
    if (!accessToken || !userId || !familyId) return;
    void syncPushRegistration();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void syncPushRegistration();
    });
    return () => subscription.remove();
  }, [accessToken, familyId, userId]);
}

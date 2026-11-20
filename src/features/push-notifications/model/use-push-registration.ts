import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import {
  markPushPermissionAsked,
  pendingPushRemovals,
  pushPermissionAsked,
  registerPushToken,
  removePendingPushRemoval,
  removePushToken,
  savedPushToken,
  savedPushTokenUserId,
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

// В foreground показываем баннер и список; звук и badge не навязываем.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
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

  const projectId = expoProjectId();
  if (!projectId) {
    pushLog('нет extra.eas.projectId: Expo-токен не получить');
    return null;
  }
  try {
    return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (error) {
    pushLog('Expo не выдал токен', { error: String(error) });
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

async function syncPushToken(userId: string) {
  const token = await requestExpoToken();
  if (!token) return;
  if (savedPushToken() === token && savedPushTokenUserId() === userId) return;
  try {
    await registerPushToken({
      token,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
      installationId: installationId(),
    });
    savePushToken(token, userId);
  } catch (error) {
    // 409 PUSH_TOKEN_OWNED: токен закреплён за другой установкой. Молча не
    // затираем и повторим на следующем запуске.
    pushLog('сервер не принял push-токен', {
      status: isApiError(error) ? error.status : null,
    });
  }
}

/**
 * Синхронизация токена с сервером для текущего аккаунта: сначала закрываем
 * неотправленные удаления, затем регистрируем токен этой установки.
 */
export async function syncPushRegistration() {
  const session = useSessionStore.getState().session;
  if (!session) return;
  await retryPendingRemovals();
  await syncPushToken(session.user.id);
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

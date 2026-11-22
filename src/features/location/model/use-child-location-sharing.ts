import { useEffect } from 'react';
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import * as Location from 'expo-location';

import {
  useSessionFamilyId,
  useSessionKind,
  useSessionStore,
} from '@entities/session';
import { i18n } from '@shared/i18n';
import { showToast } from '@shared/lib';
import {
  isLocationSharingEnabled,
  setLocationSharingEnabled,
} from './location-sharing-preference';
import {
  startChildLocationTask,
  stopChildLocationTask,
} from './child-location-task';
import { cancelActiveLocationPublish } from './publish-location';
import {
  useLocationSharingStore,
  type SharingError,
} from './location-sharing-store';

async function readStatus() {
  const [foreground, background, services] = await Promise.all([
    Location.getForegroundPermissionsAsync(),
    Location.getBackgroundPermissionsAsync(),
    Location.hasServicesEnabledAsync(),
  ]);
  return {
    foreground: foreground.granted,
    background: background.granted,
    limited: foreground.ios?.accuracy === 'reduced',
    services,
  };
}

async function syncTask(enabled: boolean) {
  if (Platform.OS === 'web') return;
  try {
    if (enabled) {
      await startChildLocationTask();
    } else {
      cancelActiveLocationPublish();
      await stopChildLocationTask();
    }
  } catch {
    useLocationSharingStore.getState().setError('start');
  }
}

async function checkSharing(userId: string, familyId: string) {
  if (Platform.OS === 'web') return;
  const store = useLocationSharingStore.getState();
  store.setChecking(true);
  try {
    const status = await readStatus();
    store.setStatus(status);
    const session = useSessionStore.getState().session;
    if (session?.user.id !== userId || session.user.family?.id !== familyId) {
      return;
    }
    if (!isLocationSharingEnabled(userId, familyId)) {
      await syncTask(false);
      store.setError(null);
      return;
    }
    if (!status.foreground || !status.background) {
      store.setError('permission');
      await syncTask(false);
      return;
    }
    if (!status.services) {
      store.setError('services');
      await syncTask(false);
      return;
    }
    store.setError(null);
    await syncTask(true);
  } finally {
    useLocationSharingStore.getState().setChecking(false);
  }
}

async function requestNotificationPermission() {
  if (Platform.OS !== 'android' || Number(Platform.Version) < 33) return true;
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function enableLocationSharing(userId: string, familyId: string) {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (!foreground.granted) {
    useLocationSharingStore.getState().setError('permission');
    return false;
  }
  if (!(await requestNotificationPermission())) {
    useLocationSharingStore.getState().setError('notifications');
    return false;
  }
  const background = await Location.requestBackgroundPermissionsAsync();
  if (!background.granted) {
    useLocationSharingStore.getState().setError('permission');
    return false;
  }
  setLocationSharingEnabled(userId, familyId, true);
  useLocationSharingStore.getState().setEnabled(true);
  await checkSharing(userId, familyId);
  return true;
}

export async function disableLocationSharing(userId: string, familyId: string) {
  // Сначала блокируем новые отправки в задаче, затем снимаем регистрацию.
  setLocationSharingEnabled(userId, familyId, false);
  useLocationSharingStore.getState().setEnabled(false);
  await syncTask(false);
  useLocationSharingStore.getState().setError(null);
}

/** Запускает/останавливает фон при смене аккаунта, семьи и разрешений. */
export function useChildLocationSharingSync() {
  const userId = useSessionStore((state) => state.session?.user.id ?? null);
  const kind = useSessionKind();
  const familyId = useSessionFamilyId();
  const enabled = useLocationSharingStore((state) => state.enabled);
  const owner = useLocationSharingStore((state) => state.owner);

  useEffect(() => {
    const store = useLocationSharingStore.getState();
    if (kind !== 'child' || !userId || !familyId) {
      store.setOwner(null);
      store.setEnabled(false);
      store.setError(null);
      void syncTask(false);
      return;
    }
    const nextOwner = `${userId}:${familyId}`;
    if (owner !== nextOwner) store.setOwner(nextOwner);
    store.setEnabled(isLocationSharingEnabled(userId, familyId));
  }, [familyId, kind, owner, userId]);

  useEffect(() => {
    if (kind !== 'child' || !userId || !familyId) return;
    void checkSharing(userId, familyId);
  }, [enabled, familyId, kind, userId]);

  useEffect(() => {
    if (kind !== 'child' || !userId || !familyId) return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void checkSharing(userId, familyId);
      }
    });
    return () => subscription.remove();
  }, [familyId, kind, userId]);
}

export function sharingErrorMessage(error: SharingError) {
  if (error === 'notifications') {
    return i18n.t('locationSharing.notificationsDenied');
  }
  if (error === 'permission') return i18n.t('locationSharing.permissionDenied');
  if (error === 'services') return i18n.t('locationSharing.servicesOff');
  if (error === 'start') return i18n.t('locationSharing.startFailed');
  return null;
}

/** Показывает системную ошибку только по действию пользователя. */
export async function enableLocationSharingWithToast(
  userId: string,
  familyId: string,
) {
  const enabled = await enableLocationSharing(userId, familyId);
  if (enabled) {
    showToast(i18n.t('locationSharing.enabledToast'));
  } else {
    const message = sharingErrorMessage(
      useLocationSharingStore.getState().error,
    );
    if (message) showToast(message);
  }
  return enabled;
}

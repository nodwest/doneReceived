import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { ApiError, apiRequest, hasApiErrorCode } from '@shared/api';
import { i18n } from '@shared/i18n';
import { useSessionStore, type SessionUser } from '@entities/session';
import {
  isLocationSharingEnabled,
  setLocationSharingEnabled,
} from './location-sharing-preference';
import {
  publishChildLocation,
  type LocationSessionBinding,
} from './publish-location';

export const CHILD_LOCATION_TASK = 'done-received-child-location';

/** Свежее этого возраста точки ещё имеют смысл для карты. */
const MAX_POINT_AGE_MS = 10 * 60_000;
const MAX_FUTURE_SKEW_MS = 2 * 60_000;
const MAX_ATTEMPTS = 2;
const RETRY_MS = 1_000;

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function isTerminal(error: unknown) {
  return (
    error instanceof ApiError &&
    (error.status === 403 ||
      hasApiErrorCode(error, 'DEVICE_NOT_TRACKED') ||
      hasApiErrorCode(error, 'FORBIDDEN_ROLE'))
  );
}

function isIgnored(error: unknown) {
  return (
    error instanceof ApiError &&
    (error.status === 401 ||
      error.status === 429 ||
      hasApiErrorCode(error, 'STALE_LOCATION') ||
      hasApiErrorCode(error, 'SESSION_CHANGED'))
  );
}

if (!TaskManager.isTaskDefined(CHILD_LOCATION_TASK)) {
  TaskManager.defineTask(CHILD_LOCATION_TASK, async ({ data, error }) => {
    if (error) return;
    const location = (
      data as { locations?: Location.LocationObject[] } | null
    )?.locations?.at(-1);
    if (!location) return;

    // Headless-запуск не монтирует UI: поднимаем сессию из SecureStore.
    await useSessionStore.getState().restore();
    if (!(await useSessionStore.getState().syncStoredSession())) return;
    const session = useSessionStore.getState().session;
    if (!session || session.user.kind !== 'child') return;

    let familyId = session.user.family?.id;
    const userId = session.user.id;
    if (!familyId) {
      // Старая детская сессия могла быть сохранена до появления family.
      try {
        const me = await apiRequest<SessionUser>('/users/me');
        familyId = me.family?.id;
        if (familyId) await useSessionStore.getState().updateUser(me);
      } catch {
        return;
      }
    }
    if (!familyId) return;
    if (!isLocationSharingEnabled(userId, familyId)) return;

    const now = Date.now();
    if (
      location.timestamp > now + MAX_FUTURE_SKEW_MS ||
      now - location.timestamp > MAX_POINT_AGE_MS
    ) {
      return;
    }

    const background = await Location.getBackgroundPermissionsAsync();
    if (!background.granted) return;
    if (!(await Location.hasServicesEnabledAsync())) return;

    const binding: LocationSessionBinding = {
      userId,
      familyId,
      storageEpoch: session.storageEpoch ?? 0,
    };
    const point = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      accuracy: location.coords.accuracy,
      recordedAt: new Date(location.timestamp).toISOString(),
    };

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      if (!isLocationSharingEnabled(userId, familyId)) return;
      try {
        await publishChildLocation(binding, point);
        return;
      } catch (publishError) {
        if (isIgnored(publishError)) return;
        if (isTerminal(publishError)) {
          // Устройство отвязано или роль сменилась:
          // прекращаем фон и не просим разрешения заново молча.
          setLocationSharingEnabled(userId, familyId, false);
          await stopChildLocationTask();
          return;
        }
        if (attempt + 1 >= MAX_ATTEMPTS) return;
        await wait(RETRY_MS);
      }
    }
  });
}

export async function startChildLocationTask() {
  if (await Location.hasStartedLocationUpdatesAsync(CHILD_LOCATION_TASK)) {
    return;
  }
  await Location.startLocationUpdatesAsync(CHILD_LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    distanceInterval: 50,
    timeInterval: 30_000,
    deferredUpdatesInterval: 30_000,
    deferredUpdatesDistance: 50,
    pausesUpdatesAutomatically: false,
    activityType: Location.ActivityType.Other,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: i18n.t('locationSharing.notificationTitle'),
      notificationBody: i18n.t('locationSharing.notificationBody'),
      notificationColor: '#6C5CE7',
      killServiceOnDestroy: true,
    },
  });
}

export async function stopChildLocationTask() {
  if (await Location.hasStartedLocationUpdatesAsync(CHILD_LOCATION_TASK)) {
    await Location.stopLocationUpdatesAsync(CHILD_LOCATION_TASK);
  }
}

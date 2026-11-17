import { createMMKV } from 'react-native-mmkv';

/**
 * Выбор шаринга хранится отдельно для аккаунта и семьи. Ключ не содержит
 * координат и не является секретом. Новым установкам шаринг не включается:
 * значения по умолчанию нет.
 */
const storage = createMMKV({ id: 'location-sharing' });

export function locationSharingKey(userId: string, familyId: string) {
  return `sharing:${userId}:${familyId}`;
}

export function isLocationSharingEnabled(
  userId: string,
  familyId: string,
): boolean {
  return storage.getBoolean(locationSharingKey(userId, familyId)) === true;
}

export function setLocationSharingEnabled(
  userId: string,
  familyId: string,
  enabled: boolean,
) {
  storage.set(locationSharingKey(userId, familyId), enabled);
}

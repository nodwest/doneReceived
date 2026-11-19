import { File } from 'expo-file-system';
import type { PickedPhoto } from './pick-photos';

/**
 * Добавить фото в FormData. В Expo SDK 56 глобальный fetch — это expo/fetch:
 * он не понимает React Native-описание `{ uri, name, type }` и падает ещё до
 * отправки запроса («нет связи»). Поэтому отдаём объект с `bytes()` — его
 * expo/fetch читает сам. `uri` оставляем для RN fetch, если его включат через
 * EXPO_PUBLIC_USE_RN_FETCH.
 */
export async function appendPhoto(
  form: FormData,
  field: string,
  photo: PickedPhoto,
) {
  const file = new File(photo.uri);
  form.append(field, {
    uri: photo.uri,
    name: photo.name,
    type: photo.type,
    bytes: () => file.bytes(),
  } as unknown as Blob);
}

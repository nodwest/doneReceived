import type { ImageSourcePropType } from 'react-native';
import type { PickedPhoto } from './pick-photos';

type RemoteSource = { uri: string; headers?: Record<string, string> };

/** Ссылки на скачанные фото, пока их не освободили. */
const downloaded = new Set<string>();

/**
 * Скачать фото с сервера, чтобы отправить его снова: ручки фото заменяют
 * весь набор, и оставшиеся старые фото уходят вместе с новыми.
 * После отправки ссылку освобождает `discardDownloadedPhoto`.
 */
export async function downloadPhoto(
  source: ImageSourcePropType,
  index = 0,
): Promise<PickedPhoto> {
  const { uri, headers } = source as RemoteSource;
  const response = await fetch(uri, { headers });
  if (!response.ok) throw new Error(String(response.status));
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  downloaded.add(url);
  return {
    uri: url,
    name: `photo-${Date.now()}-${index}.jpg`,
    type: 'image/jpeg',
    width: 0,
    height: 0,
  };
}

/** Освободить фото из `downloadPhoto`. */
export function discardDownloadedPhoto(photo: PickedPhoto) {
  if (!downloaded.delete(photo.uri)) return;
  URL.revokeObjectURL(photo.uri);
}

/** Освободить все скачанные фото: сессия кончилась. */
export function clearDownloadedPhotos() {
  for (const url of downloaded) URL.revokeObjectURL(url);
  downloaded.clear();
}

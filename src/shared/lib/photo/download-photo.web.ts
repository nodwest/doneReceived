import type { ImageSourcePropType } from 'react-native';
import type { PickedPhoto } from './pick-photos';

type RemoteSource = { uri: string; headers?: Record<string, string> };

/**
 * Скачать фото с сервера, чтобы отправить его снова: ручки фото заменяют
 * весь набор, и оставшиеся старые фото уходят вместе с новыми.
 */
export async function downloadPhoto(
  source: ImageSourcePropType,
  index = 0,
): Promise<PickedPhoto> {
  const { uri, headers } = source as RemoteSource;
  const response = await fetch(uri, { headers });
  if (!response.ok) throw new Error(String(response.status));
  const blob = await response.blob();
  return {
    uri: URL.createObjectURL(blob),
    name: `photo-${Date.now()}-${index}.jpg`,
    type: 'image/jpeg',
    width: 0,
    height: 0,
  };
}

import { Directory, File, Paths } from 'expo-file-system';
import type { ImageSourcePropType } from 'react-native';
import type { PickedPhoto } from './pick-photos';

type RemoteSource = { uri: string; headers?: Record<string, string> };

/**
 * Скачать фото с сервера во временный файл, чтобы отправить его снова: ручки
 * фото заменяют весь набор, и оставшиеся старые фото уходят вместе с новыми.
 */
export async function downloadPhoto(
  source: ImageSourcePropType,
  index = 0,
): Promise<PickedPhoto> {
  const { uri, headers } = source as RemoteSource;
  const directory = new Directory(Paths.cache, 'photo-upload');
  if (!directory.exists) directory.create({ intermediates: true });
  const name = `photo-${Date.now()}-${index}.jpg`;
  const file = await File.downloadFileAsync(uri, new File(directory, name), {
    headers,
    idempotent: true,
  });
  return { uri: file.uri, name, type: 'image/jpeg', width: 0, height: 0 };
}

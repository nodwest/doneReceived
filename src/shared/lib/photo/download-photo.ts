import { Directory, File, Paths } from 'expo-file-system';
import type { ImageSourcePropType } from 'react-native';
import type { PickedPhoto } from './pick-photos';

type RemoteSource = { uri: string; headers?: Record<string, string> };

/** Папка скачанных для повторной отправки фото — только на время запроса. */
const uploadDirectory = () => new Directory(Paths.cache, 'photo-upload');

/**
 * Скачать фото с сервера во временный файл, чтобы отправить его снова: ручки
 * фото заменяют весь набор, и оставшиеся старые фото уходят вместе с новыми.
 * После отправки файл удаляет `discardDownloadedPhoto`.
 */
export async function downloadPhoto(
  source: ImageSourcePropType,
  index = 0,
): Promise<PickedPhoto> {
  const { uri, headers } = source as RemoteSource;
  const directory = uploadDirectory();
  if (!directory.exists) directory.create({ intermediates: true });
  const name = `photo-${Date.now()}-${index}.jpg`;
  const file = await File.downloadFileAsync(uri, new File(directory, name), {
    headers,
    idempotent: true,
  });
  return { uri: file.uri, name, type: 'image/jpeg', width: 0, height: 0 };
}

/** Удалить файл из `downloadPhoto`: фото детей не остаются на диске. */
export function discardDownloadedPhoto(photo: PickedPhoto) {
  try {
    const file = new File(photo.uri);
    if (file.exists) file.delete();
  } catch {
    // Не удалился сейчас — уберёт `clearDownloadedPhotos` при выходе.
  }
}

/**
 * Удалить все скачанные фото: на случай, если отправку прервали (приложение
 * закрыли посреди запроса). Вызывается, когда сессия кончилась.
 */
export function clearDownloadedPhotos() {
  try {
    const directory = uploadDirectory();
    if (directory.exists) directory.delete();
  } catch {
    // Кэш почистит система.
  }
}

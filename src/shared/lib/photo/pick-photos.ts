import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

/**
 * Фото, выбранное на устройстве и подготовленное к загрузке: уменьшено и
 * сжато в JPEG, чтобы влезть в лимит сервера (2 МиБ и 16 Мп на файл).
 */
export type PickedPhoto = {
  /** Локальный адрес файла (в вебе — blob: или data:). */
  uri: string;
  name: string;
  type: 'image/jpeg';
  width: number;
  height: number;
};

/** Длинная сторона после уменьшения: ~3 Мп, JPEG выходит до ~1 МиБ. */
const MAX_SIDE = 2048;
const QUALITY = 0.8;

export type PhotoSource = 'camera' | 'library';

/**
 * Не дали доступ к камере. Отказ галереи не бывает: системный выбор фото
 * разрешения не требует.
 */
export class PhotoPermissionError extends Error {
  constructor() {
    super('Camera permission denied');
    this.name = 'PhotoPermissionError';
  }
}

async function prepare(asset: ImagePicker.ImagePickerAsset, index: number) {
  const { width, height } = asset;
  const scale =
    width && height ? Math.min(1, MAX_SIDE / Math.max(width, height)) : 1;
  const context = ImageManipulator.manipulate(asset.uri);
  if (scale < 1) {
    context.resize(
      width >= height
        ? { width: Math.round(width * scale) }
        : { height: Math.round(height * scale) },
    );
  }
  const image = await context.renderAsync();
  const result = await image.saveAsync({
    compress: QUALITY,
    format: SaveFormat.JPEG,
  });
  return {
    uri: result.uri,
    name: `photo-${Date.now()}-${index}.jpg`,
    type: 'image/jpeg' as const,
    width: result.width,
    height: result.height,
  };
}

/**
 * Снять фото камерой или выбрать из галереи (`limit` — сколько можно выбрать
 * за раз). Пустой массив — пользователь передумал. Камера без разрешения —
 * `PhotoPermissionError`.
 */
export async function pickPhotos(
  source: PhotoSource,
  limit = 1,
): Promise<PickedPhoto[]> {
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    quality: 1,
    allowsMultipleSelection: source === 'library' && limit > 1,
    selectionLimit: limit,
    exif: false,
  };
  let result: ImagePicker.ImagePickerResult;
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) throw new PhotoPermissionError();
    result = await ImagePicker.launchCameraAsync(options);
  } else {
    result = await ImagePicker.launchImageLibraryAsync(options);
  }
  if (result.canceled) return [];
  return Promise.all(result.assets.slice(0, limit).map(prepare));
}

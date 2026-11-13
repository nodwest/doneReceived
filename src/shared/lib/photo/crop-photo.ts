import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import type { PickedPhoto } from './pick-photos';

/** Квадрат в пикселях фото: что вырезать. */
export type CropRect = {
  originX: number;
  originY: number;
  size: number;
};

/** Сторона готовой аватарки: на экране она не больше ~120pt даже на 3x. */
const AVATAR_SIDE = 1024;
const QUALITY = 0.85;

/**
 * Вырезать квадрат из фото и сохранить JPEG не больше AVATAR_SIDE. Круг
 * рисует интерфейс, на сервер уходит квадрат.
 */
export async function cropPhoto(
  photo: PickedPhoto,
  rect: CropRect,
): Promise<PickedPhoto> {
  // Края округляем внутрь фото: дробный или выходящий за край квадрат
  // manipulator не примет.
  const size = Math.max(
    1,
    Math.min(Math.round(rect.size), photo.width, photo.height),
  );
  const originX = Math.min(
    Math.max(Math.round(rect.originX), 0),
    photo.width - size,
  );
  const originY = Math.min(
    Math.max(Math.round(rect.originY), 0),
    photo.height - size,
  );
  const context = ImageManipulator.manipulate(photo.uri);
  context.crop({ originX, originY, width: size, height: size });
  if (size > AVATAR_SIDE) {
    context.resize({ width: AVATAR_SIDE, height: AVATAR_SIDE });
  }
  const image = await context.renderAsync();
  const result = await image.saveAsync({
    compress: QUALITY,
    format: SaveFormat.JPEG,
  });
  return {
    uri: result.uri,
    name: `avatar-${Date.now()}.jpg`,
    type: 'image/jpeg',
    width: result.width,
    height: result.height,
  };
}

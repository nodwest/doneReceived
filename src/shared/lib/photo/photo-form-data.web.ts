import type { PickedPhoto } from './pick-photos';

/** Добавить фото в FormData. В вебе локальный адрес читаем в Blob. */
export async function appendPhoto(
  form: FormData,
  field: string,
  photo: PickedPhoto,
) {
  const blob = await (await fetch(photo.uri)).blob();
  form.append(field, blob, photo.name);
}

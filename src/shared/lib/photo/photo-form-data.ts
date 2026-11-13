import type { PickedPhoto } from './pick-photos';

/**
 * Добавить фото в FormData. На iOS и Android файл передаётся описанием
 * `{ uri, name, type }` — fetch сам прочитает его с диска.
 */
export async function appendPhoto(
  form: FormData,
  field: string,
  photo: PickedPhoto,
) {
  form.append(field, {
    uri: photo.uri,
    name: photo.name,
    type: photo.type,
  } as unknown as Blob);
}

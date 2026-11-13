import { i18n } from '../../i18n';
import { showToast } from '../toast';
import {
  pickPhotos,
  PhotoPermissionError,
  type PhotoSource,
  type PickedPhoto,
} from './pick-photos';

/**
 * `pickPhotos` для кнопок камеры и галереи: ошибки не бросает, а показывает
 * тостом (нет доступа к камере, не удалось открыть фото). Пустой массив —
 * ничего не выбрали.
 */
export async function choosePhotos(
  source: PhotoSource,
  limit = 1,
): Promise<PickedPhoto[]> {
  try {
    return await pickPhotos(source, limit);
  } catch (error) {
    showToast(
      i18n.t(
        error instanceof PhotoPermissionError
          ? 'photos.cameraDenied'
          : 'photos.pickFailed',
      ),
    );
    return [];
  }
}

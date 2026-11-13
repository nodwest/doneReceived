import { isApiError } from '../../api';

/**
 * Ключ тоста `photos.*` по ошибке загрузки фото: 413 — файл больше 2 МиБ,
 * 503 — сервер занят обработкой фото, остальное — общее «не получилось».
 */
export function photoUploadError(error: unknown) {
  if (isApiError(error) && error.status === 413) return 'tooLarge' as const;
  if (isApiError(error) && error.status === 503) return 'busy' as const;
  return 'uploadFailed' as const;
}

import { apiRequest, authorizedImage } from '@shared/api';
import { appendPhoto, downloadPhoto } from '@shared/lib';
import {
  WishPhotosError,
  type Wish,
  type WishPayload,
  type WishPhotoDraft,
} from '../model/wish';

// Вишлист ребёнка на сервере. Цена — в центах с валютой (у нас целые
// доллары, USD); описание — note, ссылка — storeUrl (только https://).
// Порядок — position (0 — главное желание), «Make it my top wish» — top.
// Фото приходят списком и читаются с Bearer-токеном; набор фото меняется
// целиком (`PUT …/photos`, до 3 файлов) или удаляется (`DELETE …/photos`).

type WishDto = {
  id: string;
  childId: string;
  title: string;
  note: string | null;
  priceMinor: number | null;
  currency: string | null;
  storeUrl: string | null;
  /** Место в списке: 0 — самое важное желание. */
  position: number;
  /** Фото желания: url — относительный адрес картинки (WebP). */
  photos?: { id: string; url: string }[];
  createdAt: string;
};

const toWish = (dto: WishDto): Wish => ({
  id: dto.id,
  childId: dto.childId,
  title: dto.title,
  price: Math.round((dto.priceMinor ?? 0) / 100),
  description: dto.note ?? '',
  link: dto.storeUrl ?? '',
  photos: (dto.photos ?? []).map((photo) => authorizedImage(photo.url)),
  createdAt: dto.createdAt,
  position: dto.position,
});

/**
 * Тело POST и PUT: пустые необязательные поля не отправляем (PUT их очистит).
 * top — поставить желание первым; без него новое встаёт в конец, правленое
 * остаётся на своём месте.
 */
const toBody = ({ title, price, description, link, top }: WishPayload) => ({
  title,
  ...(top ? { top: true } : {}),
  ...(description ? { note: description } : {}),
  ...(price > 0 ? { priceMinor: price * 100, currency: 'USD' } : {}),
  ...(link ? { storeUrl: httpsUrl(link) } : {}),
});

/** Сервер принимает только https://: без протокола или с http — дописываем. */
const httpsUrl = (link: string) =>
  `https://${link.replace(/^https?:\/\//i, '')}`;

const base = (familyId: string, childId: string) =>
  `/families/${familyId}/children/${childId}/wishes`;

/** GET …/wishes — все желания по порядку (position, затем id), главное первым. */
export async function fetchServerWishes(familyId: string, childId: string) {
  const list = await apiRequest<WishDto[]>(base(familyId, childId));
  return [...list]
    .sort(
      (a, b) =>
        a.position - b.position || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    )
    .map(toWish);
}

/**
 * PUT …/wishes/order — новый порядок: все id ребёнка ровно по разу, сверху
 * вниз. Меняет только сам ребёнок; 400 `WISH_ORDER_MISMATCH` — список не
 * совпал с сервером (кто-то добавил или удалил желание).
 */
export function reorderServerWishes(
  familyId: string,
  childId: string,
  ids: readonly string[],
) {
  return apiRequest<null>(`${base(familyId, childId)}/order`, {
    method: 'PUT',
    body: { ids },
  });
}

/**
 * Сохранить набор фото желания. Сервер заменяет набор целиком, поэтому
 * оставшиеся старые фото скачиваем и отправляем вместе с новыми; пустой
 * набор — удалить все фото. Ошибка — `WishPhotosError` (само желание уже
 * сохранено).
 */
async function saveServerWishPhotos(
  familyId: string,
  childId: string,
  id: string,
  photos: readonly WishPhotoDraft[],
) {
  const path = `${base(familyId, childId)}/${id}/photos`;
  try {
    if (photos.length === 0) {
      await apiRequest<null>(path, { method: 'DELETE' });
      return;
    }
    const form = new FormData();
    for (const [index, photo] of photos.entries()) {
      const file = photo.file ?? (await downloadPhoto(photo.source, index));
      await appendPhoto(form, 'photos', file);
    }
    await apiRequest<unknown>(path, { method: 'PUT', body: form });
  } catch (error) {
    throw new WishPhotosError(error);
  }
}

/**
 * POST …/wishes — добавляет только сам ребёнок; уже WISHLIST_MAX_ITEMS —
 * 409 `WISHLIST_LIMIT_REACHED`.
 */
export async function createServerWish(
  familyId: string,
  childId: string,
  payload: WishPayload,
) {
  const wish = toWish(
    await apiRequest<WishDto>(base(familyId, childId), {
      method: 'POST',
      body: toBody(payload),
    }),
  );
  if (payload.photos?.length) {
    await saveServerWishPhotos(familyId, childId, wish.id, payload.photos);
  }
  return wish;
}

/** PUT …/wishes/:id — полная замена. */
export async function updateServerWish(
  familyId: string,
  childId: string,
  id: string,
  payload: WishPayload,
) {
  const wish = toWish(
    await apiRequest<WishDto>(`${base(familyId, childId)}/${id}`, {
      method: 'PUT',
      body: toBody(payload),
    }),
  );
  if (payload.photos) {
    await saveServerWishPhotos(familyId, childId, id, payload.photos);
  }
  return wish;
}

/** DELETE …/wishes/:id — повторное удаление тоже 204. */
export function deleteServerWish(
  familyId: string,
  childId: string,
  id: string,
) {
  return apiRequest<null>(`${base(familyId, childId)}/${id}`, {
    method: 'DELETE',
  });
}

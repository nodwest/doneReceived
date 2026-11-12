import { apiRequest } from '@shared/api';
import type { Wish, WishPayload } from '../model/wish';

// Вишлист ребёнка на сервере. Цена — в центах с валютой (у нас целые
// доллары, USD); описание — note, ссылка — storeUrl (только https://). Фото
// и порядка на сервере нет (Идеи.md п. 17): фото не отправляем, порядок —
// по времени добавления, старые сверху.

type WishDto = {
  id: string;
  childId: string;
  title: string;
  note: string | null;
  priceMinor: number | null;
  currency: string | null;
  storeUrl: string | null;
  createdAt: string;
};

const toWish = (dto: WishDto): Wish => ({
  id: dto.id,
  childId: dto.childId,
  title: dto.title,
  price: Math.round((dto.priceMinor ?? 0) / 100),
  description: dto.note ?? '',
  link: dto.storeUrl ?? '',
  photos: [],
  createdAt: dto.createdAt,
});

/** Тело POST и PUT: пустые необязательные поля не отправляем (PUT их очистит). */
const toBody = ({ title, price, description, link }: WishPayload) => ({
  title,
  ...(description ? { note: description } : {}),
  ...(price > 0 ? { priceMinor: price * 100, currency: 'USD' } : {}),
  ...(link ? { storeUrl: httpsUrl(link) } : {}),
});

/** Сервер принимает только https://: без протокола или с http — дописываем. */
const httpsUrl = (link: string) =>
  `https://${link.replace(/^https?:\/\//i, '')}`;

const base = (familyId: string, childId: string) =>
  `/families/${familyId}/children/${childId}/wishes`;

/** GET …/wishes — до 100 желаний; сервер отдаёт новые первыми. */
export async function fetchServerWishes(familyId: string, childId: string) {
  const list = await apiRequest<WishDto[]>(base(familyId, childId));
  return list
    .map(toWish)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/** POST …/wishes — добавляет только сам ребёнок. */
export async function createServerWish(
  familyId: string,
  childId: string,
  payload: WishPayload,
) {
  return toWish(
    await apiRequest<WishDto>(base(familyId, childId), {
      method: 'POST',
      body: toBody(payload),
    }),
  );
}

/** PUT …/wishes/:id — полная замена. */
export async function updateServerWish(
  familyId: string,
  childId: string,
  id: string,
  payload: WishPayload,
) {
  return toWish(
    await apiRequest<WishDto>(`${base(familyId, childId)}/${id}`, {
      method: 'PUT',
      body: toBody(payload),
    }),
  );
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

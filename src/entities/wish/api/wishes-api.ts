import type { UpdateWishPayload, Wish, WishPayload } from '../model/wish';
import { mockServer } from './mock-server';

// Эндпоинты вишлиста. Пока бэкенда нет, тела ходят в mockServer; с API здесь
// будут запросы (GET /children/:id/wishes, POST /wishes, PATCH /wishes/:id,
// DELETE /wishes/:id, PUT /wishes/order), сигнатуры не меняются.

/** Вишлист ребёнка в порядке приоритета. */
export async function fetchWishes(childId: number): Promise<Wish[]> {
  return mockServer.list(childId);
}

export async function createWish(payload: WishPayload): Promise<Wish> {
  return mockServer.create(payload);
}

export async function updateWish(payload: UpdateWishPayload): Promise<Wish> {
  return mockServer.update(payload);
}

export async function deleteWish(id: number): Promise<void> {
  mockServer.remove(id);
}

/** Новый порядок желаний: id сверху вниз. */
export async function reorderWishes(ids: readonly number[]): Promise<void> {
  mockServer.reorder(ids);
}

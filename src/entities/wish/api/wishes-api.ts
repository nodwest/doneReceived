import type {
  UpdateWishPayload,
  Wish,
  WishlistOwner,
  WishPayload,
} from '../model/wish';
import { mockServer } from './mock-server';
import {
  createServerWish,
  deleteServerWish,
  fetchServerWishes,
  reorderServerWishes,
  updateServerWish,
} from './server-wishes-api';

// Эндпоинты вишлиста. Ребёнок с сервера (UUID) — API, моковые Emma и Liam —
// mockServer.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Вишлист ребёнка с сервера (UUID): фото желаний пока не загружаем. */
export const isServerWishlist = ({ childId }: WishlistOwner) =>
  UUID.test(childId);

/** Семья ребёнка с сервера; без неё запрос не собрать. */
function serverFamily(owner: WishlistOwner) {
  if (!owner.familyId) throw new Error('No family');
  return owner.familyId;
}

/** Вишлист ребёнка в порядке приоритета. */
export async function fetchWishes(owner: WishlistOwner): Promise<Wish[]> {
  if (isServerWishlist(owner)) {
    return fetchServerWishes(serverFamily(owner), owner.childId);
  }
  return mockServer.list(owner.childId);
}

export async function createWish(
  owner: WishlistOwner,
  payload: WishPayload,
): Promise<Wish> {
  if (isServerWishlist(owner)) {
    return createServerWish(serverFamily(owner), owner.childId, payload);
  }
  return mockServer.create(payload);
}

export async function updateWish(
  owner: WishlistOwner,
  { id, ...payload }: UpdateWishPayload,
): Promise<Wish> {
  if (isServerWishlist(owner)) {
    return updateServerWish(serverFamily(owner), owner.childId, id, payload);
  }
  return mockServer.update({ id, ...payload });
}

export async function deleteWish(
  owner: WishlistOwner,
  id: string,
): Promise<void> {
  if (isServerWishlist(owner)) {
    await deleteServerWish(serverFamily(owner), owner.childId, id);
    return;
  }
  mockServer.remove(id);
}

/** Новый порядок желаний: id сверху вниз. */
export async function reorderWishes(
  owner: WishlistOwner,
  ids: readonly string[],
): Promise<void> {
  if (isServerWishlist(owner)) {
    await reorderServerWishes(serverFamily(owner), owner.childId, ids);
    return;
  }
  mockServer.reorder(ids);
}

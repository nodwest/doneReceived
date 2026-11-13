import type {
  UpdateWishPayload,
  Wish,
  WishlistOwner,
  WishPayload,
} from '../model/wish';
import {
  createServerWish,
  deleteServerWish,
  fetchServerWishes,
  reorderServerWishes,
  updateServerWish,
} from './server-wishes-api';

// Эндпоинты вишлиста ребёнка — на сервере.

/** Семья ребёнка; без неё запрос не собрать. */
function serverFamily(owner: WishlistOwner) {
  if (!owner.familyId) throw new Error('No family');
  return owner.familyId;
}

/** Вишлист ребёнка в порядке приоритета. */
export async function fetchWishes(owner: WishlistOwner): Promise<Wish[]> {
  return fetchServerWishes(serverFamily(owner), owner.childId);
}

export async function createWish(
  owner: WishlistOwner,
  payload: WishPayload,
): Promise<Wish> {
  return createServerWish(serverFamily(owner), owner.childId, payload);
}

export async function updateWish(
  owner: WishlistOwner,
  { id, ...payload }: UpdateWishPayload,
): Promise<Wish> {
  return updateServerWish(serverFamily(owner), owner.childId, id, payload);
}

export async function deleteWish(
  owner: WishlistOwner,
  id: string,
): Promise<void> {
  await deleteServerWish(serverFamily(owner), owner.childId, id);
}

/** Новый порядок желаний: id сверху вниз. */
export async function reorderWishes(
  owner: WishlistOwner,
  ids: readonly string[],
): Promise<void> {
  await reorderServerWishes(serverFamily(owner), owner.childId, ids);
}

import type { ImageSourcePropType } from 'react-native';
import { isApiError } from '@shared/api';
import type { PickedPhoto } from '@shared/lib';

export interface Wish {
  /** У моков число строкой, с сервера — UUID. */
  id: string;
  /** Чьё желание: у каждого ребёнка свой вишлист. */
  childId: string;
  title: string;
  /** Цена в долларах, целая. */
  price: number;
  description: string;
  /** Ссылка на магазин; пустая строка — без ссылки. */
  link: string;
  /** Фото желания, листаются в карточке; пусто — рисуем иконку. */
  photos: ImageSourcePropType[];
  /** ISO-время, когда желание добавили. */
  createdAt: string;
  /** Место в списке с сервера: 0 — главное желание. */
  position?: number;
}

/**
 * Сколько желаний ребёнок может добавить; должно совпадать с
 * WISHLIST_MAX_ITEMS на бэкенде. Лимит только на создание: желания сверх
 * него (старые) видны, правятся, удаляются и переставляются.
 */
export const WISHLIST_MAX_ITEMS = 10;

/**
 * Желание сохранено, а фото не загрузились: форму можно закрыть, фото —
 * добавить ещё раз. `cause` — ошибка загрузки.
 */
export class WishPhotosError extends Error {
  constructor(readonly cause: unknown) {
    super('Wish photos upload failed');
    this.name = 'WishPhotosError';
  }
}

/** Сервер не дал добавить желание: уже WISHLIST_MAX_ITEMS (409). */
export const isWishlistLimitError = (error: unknown) =>
  isApiError(error) &&
  (error.data as { code?: unknown } | null)?.code === 'WISHLIST_LIMIT_REACHED';

/** Сколько фото можно у желания: столько принимает сервер. */
export const WISH_PHOTOS_MAX = 3;

/**
 * Фото в форме желания: уже загруженное (`file: null`, `source` — с сервера)
 * или только что выбранное на устройстве (`file` — что отправить).
 */
export interface WishPhotoDraft {
  source: ImageSourcePropType;
  file: PickedPhoto | null;
}

/** Поля формы New wish / Edit wish. */
export interface WishPayload {
  title: string;
  price: number;
  description: string;
  link: string;
  /** Новый набор фото; null — фото не трогали. */
  photos: WishPhotoDraft[] | null;
  /** Make it my top wish: поставить первым; иначе новое — в конец, старое — на своё место. */
  top: boolean;
}

export interface UpdateWishPayload extends WishPayload {
  id: string;
}

/**
 * Чей вишлист: ребёнок (моковый — число строкой, с сервера — UUID) и семья
 * (нужна для ребёнка с сервера, у моковых — null).
 */
export interface WishlistOwner {
  childId: string;
  familyId: string | null;
}

/** Ссылка на магазин с протоколом: в форме её вставляют и без https://. */
export const storeUrl = (link: string) =>
  /^https?:\/\//i.test(link) ? link : `https://${link}`;

import type { ImageSourcePropType } from 'react-native';

export interface Wish {
  id: number;
  /** Чьё желание: у каждого ребёнка свой вишлист. */
  childId: number;
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
}

/** Поля формы New wish / Edit wish. */
export interface WishPayload {
  title: string;
  price: number;
  description: string;
  link: string;
  photos: ImageSourcePropType[];
  /** Make it my top wish: поставить первым; иначе новое — в конец, старое — на своё место. */
  top: boolean;
}

export interface UpdateWishPayload extends WishPayload {
  id: number;
}

/** Ссылка на магазин с протоколом: в форме её вставляют и без https://. */
export const storeUrl = (link: string) =>
  /^https?:\/\//i.test(link) ? link : `https://${link}`;

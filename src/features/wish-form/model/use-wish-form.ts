import { useState } from 'react';
import {
  WISH_PHOTOS_MAX,
  type Wish,
  type WishPayload,
  type WishPhotoDraft,
} from '@entities/wish';
import type { PickedPhoto } from '@shared/lib';

// Цена — целые доллары, как награды за задания.
const MAX_PRICE_DIGITS = 5;

/**
 * Поля формы желания. Для правки стартуют с данных желания, для нового —
 * пустые. reset заполняет форму заново при каждом открытии шторки.
 */
export function useWishForm() {
  const [title, setTitle] = useState('');
  const [price, setPriceText] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [photos, setPhotos] = useState<WishPhotoDraft[]>([]);
  // Набор фото меняли: только тогда он уходит на сервер.
  const [photosChanged, setPhotosChanged] = useState(false);
  const [top, setTop] = useState(false);

  const reset = (wish?: Wish) => {
    setTitle(wish?.title ?? '');
    setPriceText(wish ? String(wish.price) : '');
    setDescription(wish?.description ?? '');
    setLink(wish?.link ?? '');
    setPhotos((wish?.photos ?? []).map((source) => ({ source, file: null })));
    setPhotosChanged(false);
    setTop(false);
  };

  // В поле цены — только цифры.
  const setPrice = (text: string) =>
    setPriceText(text.replace(/\D/g, '').slice(0, MAX_PRICE_DIGITS));

  const removePhoto = (index: number) => {
    setPhotos((current) => current.filter((_, i) => i !== index));
    setPhotosChanged(true);
  };

  /** Добавить выбранные фото; сверх WISH_PHOTOS_MAX — отбрасываются. */
  const addPhotos = (picked: readonly PickedPhoto[]) => {
    if (picked.length === 0) return;
    setPhotos((current) =>
      [
        ...current,
        ...picked.map((file) => ({ source: { uri: file.uri }, file })),
      ].slice(0, WISH_PHOTOS_MAX),
    );
    setPhotosChanged(true);
  };

  const priceValue = Number(price);
  const valid = title.trim().length > 0 && priceValue > 0;

  const payload = (): WishPayload => ({
    title: title.trim(),
    price: priceValue,
    description: description.trim(),
    link: link.trim(),
    photos: photosChanged ? photos : null,
    top,
  });

  return {
    fields: { title, price, description, link, photos, top },
    setTitle,
    setPrice,
    setDescription,
    setLink,
    removePhoto,
    addPhotos,
    setTop,
    reset,
    valid,
    payload,
  };
}

import { useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import type { Wish, WishPayload } from '@entities/wish';

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
  const [photos, setPhotos] = useState<ImageSourcePropType[]>([]);
  const [top, setTop] = useState(false);

  const reset = (wish?: Wish) => {
    setTitle(wish?.title ?? '');
    setPriceText(wish ? String(wish.price) : '');
    setDescription(wish?.description ?? '');
    setLink(wish?.link ?? '');
    setPhotos(wish?.photos ?? []);
    setTop(false);
  };

  // В поле цены — только цифры.
  const setPrice = (text: string) =>
    setPriceText(text.replace(/\D/g, '').slice(0, MAX_PRICE_DIGITS));

  const removePhoto = (index: number) =>
    setPhotos((current) => current.filter((_, i) => i !== index));

  const priceValue = Number(price);
  const valid = title.trim().length > 0 && priceValue > 0;

  const payload = (): WishPayload => ({
    title: title.trim(),
    price: priceValue,
    description: description.trim(),
    link: link.trim(),
    photos,
    top,
  });

  return {
    fields: { title, price, description, link, photos, top },
    setTitle,
    setPrice,
    setDescription,
    setLink,
    removePhoto,
    setTop,
    reset,
    valid,
    payload,
  };
}

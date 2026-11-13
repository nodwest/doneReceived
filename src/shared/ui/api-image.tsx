import { Image, type ImageProps } from 'react-native';

/**
 * Картинка, которая может прийти с API с Bearer-токеном в `source.headers`.
 * На iOS и Android `<Image>` сам отправляет заголовки; в вебе — своя версия
 * (`api-image.web.tsx`).
 */
export function ApiImage(props: ImageProps) {
  return <Image {...props} />;
}

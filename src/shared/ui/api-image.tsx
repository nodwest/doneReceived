import { Image, type ImageProps } from 'react-native';
import { currentAccessToken } from '../api';

/**
 * Картинка, которая может прийти с API с Bearer-токеном в `source.headers`.
 * На iOS и Android `<Image>` сам отправляет заголовки; токен подставляем
 * текущий: тот, что запёкся в `source` при загрузке данных, мог устареть.
 * В вебе — своя версия (`api-image.web.tsx`).
 */
export function ApiImage({ source, ...props }: ImageProps) {
  const token = currentAccessToken();
  const fresh =
    token &&
    source &&
    typeof source === 'object' &&
    !Array.isArray(source) &&
    'headers' in source &&
    source.headers
      ? {
          ...source,
          headers: { ...source.headers, Authorization: `Bearer ${token}` },
        }
      : source;
  return <Image source={fresh} {...props} />;
}

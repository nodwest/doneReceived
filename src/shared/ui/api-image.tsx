import { useMemo } from 'react';
import { Image, type ImageProps, type ImageSourcePropType } from 'react-native';
import { currentAccessToken, usePrivateReadScope } from '../api';

/** Native images use the server's private, no-store cache policy. */
export function clearPrivateImageCache() {}

type HeaderSource = { uri: string; headers: Record<string, string> };

/**
 * Источник с `headers` — картинка нашего API (`authorizedImage`). Остальные
 * (моки, ассеты, чужие ссылки без токена) отдаём как есть.
 */
function headerSource(source: ImageProps['source']): HeaderSource | null {
  return source &&
    typeof source === 'object' &&
    !Array.isArray(source) &&
    'uri' in source &&
    source.uri &&
    'headers' in source &&
    source.headers
    ? (source as HeaderSource)
    : null;
}

/**
 * Картинка, которая может прийти с API с Bearer-токеном в `source.headers`.
 * Токен подставляем текущий: тот, что запёкся в `source` при загрузке данных,
 * мог устареть.
 *
 * Заголовки уходят массивом из одного источника, хотя картинка одна: iOS
 * читает их прямо из источника, а Android — только из источника-массива
 * (`Image.android.js` передаёт их отдельным пропом). У объекта
 * `{ uri, headers }` Android заголовки молча теряет: сервер отвечает 401 и на
 * месте аватара пусто.
 *
 * В вебе — своя версия (`api-image.web.tsx`).
 */
type ApiImageProps = ImageProps & { retainInMemory?: boolean };

export function ApiImage({
  source,
  retainInMemory = true,
  ...props
}: ApiImageProps) {
  const scope = usePrivateReadScope();
  const token = currentAccessToken();
  const uri = headerSource(source)?.uri;
  const authorizedSource = useMemo<ImageSourcePropType | undefined>(
    () =>
      uri && token && scope
        ? [
            {
              uri,
              // Native decoded-image caches can be keyed by URL alone.
              cache: 'reload',
              headers: {
                Authorization: `Bearer ${token}`,
                ...(!retainInMemory ? { 'Cache-Control': 'no-store' } : {}),
              },
            },
          ]
        : undefined,
    [uri, token, scope, retainInMemory],
  );
  return (
    <Image
      key={uri ? scope : undefined}
      source={uri ? authorizedSource : source}
      fadeDuration={uri ? 0 : undefined}
      {...props}
    />
  );
}

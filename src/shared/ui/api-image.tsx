import { Image, type ImageProps, type ImageSourcePropType } from 'react-native';
import { currentAccessToken } from '../api';

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
export function ApiImage({ source, ...props }: ImageProps) {
  const token = currentAccessToken();
  const remote = headerSource(source);
  const fresh: ImageProps['source'] = remote
    ? ([
        {
          uri: remote.uri,
          headers: {
            ...remote.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      ] satisfies ImageSourcePropType[])
    : source;
  return <Image source={fresh} {...props} />;
}

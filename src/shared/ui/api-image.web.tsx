import { useEffect, useState } from 'react';
import { Image, type ImageProps } from 'react-native';
import { currentAccessToken, refreshAccessToken } from '../api';

// В вебе <img> не умеет слать заголовки, а react-native-web их отбрасывает:
// картинку с токеном скачиваем fetch'ем и показываем через blob-ссылку.
// Загруженные держим в памяти вкладки по адресу, чтобы не качать заново.
const loaded = new Map<string, Promise<string>>();
// Уже готовые blob-ссылки: новая картинка с тем же адресом (экран
// перерисовал список, переключили вкладку) берёт её сразу, в первом же
// кадре, и не мигает пустой, пока ждёт промис.
const ready = new Map<string, string>();
const MAX_CACHED = 200;

/**
 * Скачать картинку с токеном. Токен берём свежий, а не тот, что запёкся в
 * `source` при загрузке данных: он мог устареть. На 401 обновляем токены
 * тем же единственным refresh, что у запросов, и пробуем ещё раз.
 */
async function download(uri: string, sourceToken: string | null) {
  const get = (token: string | null) =>
    fetch(uri, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  const token = currentAccessToken() ?? sourceToken;
  let response = await get(token);
  if (response.status === 401 && token && (await refreshAccessToken(token))) {
    response = await get(currentAccessToken());
  }
  if (!response.ok) throw new Error(String(response.status));
  return response.blob();
}

function load(uri: string, sourceToken: string | null) {
  let pending = loaded.get(uri);
  if (!pending) {
    pending = download(uri, sourceToken).then((blob) => {
      const url = URL.createObjectURL(blob);
      ready.set(uri, url);
      return url;
    });
    // Ошибка не запоминается: при следующем показе (например, с новым
    // токеном) попробуем снова.
    pending.catch(() => loaded.delete(uri));
    loaded.set(uri, pending);
    if (loaded.size > MAX_CACHED) {
      const [oldest] = loaded.keys();
      loaded
        .get(oldest)
        ?.then((url) => URL.revokeObjectURL(url))
        .catch(() => {});
      loaded.delete(oldest);
      ready.delete(oldest);
    }
  }
  return pending;
}

type HeaderSource = { uri: string; headers: Record<string, string> };

const withHeaders = (source: ImageProps['source']): HeaderSource | null =>
  source &&
  typeof source === 'object' &&
  !Array.isArray(source) &&
  'uri' in source &&
  source.uri &&
  'headers' in source &&
  source.headers
    ? (source as HeaderSource)
    : null;

export function ApiImage({ source, ...props }: ImageProps) {
  const remote = withHeaders(source);
  const uri = remote?.uri;
  const auth = remote?.headers.Authorization;
  const [blob, setBlob] = useState<{ uri: string; url: string } | null>(null);
  const cached = uri ? ready.get(uri) : undefined;

  useEffect(() => {
    if (!uri || ready.has(uri)) return;
    let alive = true;
    load(uri, auth ? auth.replace(/^Bearer /, '') : null)
      .then((url) => {
        if (alive) setBlob({ uri, url });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [uri, auth]);

  if (!remote) return <Image source={source} {...props} />;
  const url = cached ?? (blob && blob.uri === uri ? blob.url : undefined);
  return <Image source={url ? { uri: url } : undefined} {...props} />;
}

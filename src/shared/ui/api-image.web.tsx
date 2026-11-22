import { useEffect, useState } from 'react';
import { Image, type ImageProps } from 'react-native';
import {
  currentAccessToken,
  refreshAccessToken,
  usePrivateReadScope,
} from '../api';

// В вебе <img> не умеет слать заголовки, а react-native-web их отбрасывает:
// картинку с токеном скачиваем fetch'ем и показываем через blob-ссылку.
// Загруженные держим в памяти вкладки по адресу, чтобы не качать заново.
const loaded = new Map<string, Promise<string>>();
// Уже готовые blob-ссылки: новая картинка с тем же адресом (экран
// перерисовал список, переключили вкладку) берёт её сразу, в первом же
// кадре, и не мигает пустой, пока ждёт промис.
const ready = new Map<string, string>();
const MAX_CACHED = 200;
let imageRequests = new AbortController();

export function clearPrivateImageCache() {
  imageRequests.abort();
  imageRequests = new AbortController();
  for (const url of ready.values()) URL.revokeObjectURL(url);
  loaded.clear();
  ready.clear();
}

/**
 * Скачать картинку с токеном. Токен берём свежий, а не тот, что запёкся в
 * `source` при загрузке данных: он мог устареть. На 401 обновляем токены
 * тем же единственным refresh, что у запросов, и пробуем ещё раз.
 */
async function download(uri: string, signal: AbortSignal) {
  const get = (token: string | null) =>
    fetch(uri, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
      signal,
    });
  const token = currentAccessToken();
  if (!token) throw new Error('No session');
  let response = await get(token);
  if (response.status === 401 && token && (await refreshAccessToken(token))) {
    if (signal.aborted) throw new Error('Image request cancelled');
    response = await get(currentAccessToken());
  }
  if (!response.ok) throw new Error(String(response.status));
  return response.blob();
}

function load(uri: string) {
  let pending = loaded.get(uri);
  if (!pending) {
    const { signal } = imageRequests;
    pending = download(uri, signal).then((blob) => {
      if (signal.aborted) throw new Error('Image request cancelled');
      const url = URL.createObjectURL(blob);
      ready.set(uri, url);
      return url;
    });
    // Ошибка не запоминается: при следующем показе (например, с новым
    // токеном) попробуем снова.
    pending.catch(() => {
      if (loaded.get(uri) === pending) loaded.delete(uri);
    });
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
  const scope = usePrivateReadScope();
  const [blob, setBlob] = useState<{
    scope: string;
    uri: string;
    url: string;
  } | null>(null);
  const cached = scope && uri ? ready.get(uri) : undefined;

  useEffect(() => {
    if (!scope || !uri || ready.has(uri)) return;
    let alive = true;
    load(uri)
      .then((url) => {
        if (alive) setBlob({ scope, uri, url });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [uri, scope]);

  if (!remote) return <Image source={source} {...props} />;
  const url =
    cached ??
    (blob && blob.scope === scope && blob.uri === uri ? blob.url : undefined);
  return <Image source={url ? { uri: url } : undefined} {...props} />;
}

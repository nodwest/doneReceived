import { useEffect, useState } from 'react';
import { Image, type ImageProps } from 'react-native';
import {
  currentAccessToken,
  isTrustedApiImageUrl,
  refreshAccessToken,
  usePrivateReadScope,
} from '../api';
import {
  invalidatePrivateImageGeneration,
  usePrivateImageGeneration,
} from './private-image-cache';

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
  invalidatePrivateImageGeneration();
}

/**
 * Скачать картинку с токеном. Токен берём свежий, а не тот, что запёкся в
 * `source` при загрузке данных: он мог устареть. На 401 обновляем токены
 * тем же единственным refresh, что у запросов, и пробуем ещё раз.
 */
async function download(uri: string, signal: AbortSignal) {
  if (!isTrustedApiImageUrl(uri)) throw new Error('Untrusted image origin');
  const get = (token: string | null) =>
    fetch(uri, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
      redirect: 'error',
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

function load(uri: string, key: string) {
  let pending = loaded.get(key);
  if (!pending) {
    const { signal } = imageRequests;
    pending = download(uri, signal).then((blob) => {
      if (signal.aborted) throw new Error('Image request cancelled');
      const url = URL.createObjectURL(blob);
      ready.set(key, url);
      return url;
    });
    // Ошибка не запоминается: при следующем показе (например, с новым
    // токеном) попробуем снова.
    pending.catch(() => {
      if (loaded.get(key) === pending) loaded.delete(key);
    });
    loaded.set(key, pending);
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

type ApiImageProps = ImageProps & {
  retainInMemory?: boolean;
  onImageLoad?: () => void;
};

export function ApiImage({
  source,
  retainInMemory = true,
  onImageLoad,
  onLoad,
  ...props
}: ApiImageProps) {
  const remote = withHeaders(source);
  const uri = remote?.uri;
  const scope = usePrivateReadScope();
  const generation = usePrivateImageGeneration();
  const [blob, setBlob] = useState<{
    key: string;
    url: string;
  } | null>(null);
  const cacheKey =
    scope && uri ? JSON.stringify([generation, scope, uri]) : null;
  const cached = retainInMemory && cacheKey ? ready.get(cacheKey) : undefined;

  useEffect(() => {
    if (!scope || !uri || !cacheKey || (retainInMemory && ready.has(cacheKey)))
      return;
    let alive = true;
    let objectUrl: string | undefined;
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, imageRequests.signal]);
    const pending = retainInMemory
      ? load(uri, cacheKey)
      : download(uri, signal).then((data) => {
          if (!alive || signal.aborted)
            throw new Error('Image request cancelled');
          objectUrl = URL.createObjectURL(data);
          return objectUrl;
        });
    pending
      .then((url) => {
        if (alive && !signal.aborted) setBlob({ key: cacheKey, url });
      })
      .catch(() => {});
    const revoke = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    signal.addEventListener('abort', revoke, { once: true });
    return () => {
      alive = false;
      controller.abort();
      signal.removeEventListener('abort', revoke);
    };
  }, [uri, scope, cacheKey, retainInMemory]);

  const handleLoad: ImageProps['onLoad'] = (event) => {
    onLoad?.(event);
    onImageLoad?.();
  };
  if (!remote) return <Image source={source} {...props} onLoad={handleLoad} />;
  const url = cached ?? (blob && blob.key === cacheKey ? blob.url : undefined);
  return (
    <Image
      source={url ? { uri: url } : undefined}
      {...props}
      onLoad={handleLoad}
    />
  );
}

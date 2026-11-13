import { useEffect, useState } from 'react';
import { Image, type ImageProps } from 'react-native';

// В вебе <img> не умеет слать заголовки, а react-native-web их отбрасывает:
// картинку с токеном скачиваем fetch'ем и показываем через blob-ссылку.
// Загруженные держим в памяти вкладки по адресу, чтобы не качать заново.
const loaded = new Map<string, Promise<string>>();
const MAX_CACHED = 200;

function load(uri: string, headers: Record<string, string>) {
  let pending = loaded.get(uri);
  if (!pending) {
    pending = fetch(uri, { headers })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.blob();
      })
      .then((blob) => URL.createObjectURL(blob));
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

  useEffect(() => {
    if (!uri) return;
    let alive = true;
    load(uri, auth ? { Authorization: auth } : {})
      .then((url) => {
        if (alive) setBlob({ uri, url });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [uri, auth]);

  if (!remote) return <Image source={source} {...props} />;
  return (
    <Image
      source={blob && blob.uri === uri ? { uri: blob.url } : undefined}
      {...props}
    />
  );
}

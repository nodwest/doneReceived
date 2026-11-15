import { useEffect, useState } from 'react';
import { authorizedImage } from '@shared/api';
import { useSessionStore } from '@entities/session';

type AvatarUser = {
  id: string;
  avatarUrl: string | null;
};

/**
 * Аватар отдаёт API только с Bearer-токеном. Для DOM-метки на карте
 * забираем картинку один раз и держим blob URL; ключ включает токен, чтобы
 * после обновления сессии картинка не осталась с прежними правами.
 */
const avatarCache = new Map<string, Promise<string | null>>();

function loadAvatar(url: string) {
  const image = authorizedImage(url);
  const key = `${image.headers?.Authorization ?? ''}|${image.uri}`;
  const cached = avatarCache.get(key);
  if (cached) return cached;

  const request = fetch(image.uri, { headers: image.headers })
    .then(async (response) => {
      if (!response.ok) return null;
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    })
    .catch(() => null);

  avatarCache.set(key, request);
  void request.then((url) => {
    if (!url) avatarCache.delete(key);
  });
  return request;
}

/** object URL аватаров по id пользователя; null — фото нет или не загрузилось. */
export function useUserAvatarUrls(users: readonly AvatarUser[]) {
  const token = useSessionStore((state) => state.session?.accessToken ?? null);
  const key = users
    .map((user) => `${user.id}:${user.avatarUrl ?? ''}`)
    .join('|');
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    void Promise.all(
      users.map(async (user) => {
        if (!user.avatarUrl) return [user.id, null] as const;
        return [user.id, await loadAvatar(user.avatarUrl)] as const;
      }),
    ).then((entries) => {
      if (cancelled) return;
      const next: Record<string, string> = {};
      for (const [id, url] of entries) {
        if (url) next[id] = url;
      }
      setUrls(next);
    });

    return () => {
      cancelled = true;
    };
    // key покрывает id и avatarUrl; users в замыкании соответствует key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, token]);

  return urls;
}

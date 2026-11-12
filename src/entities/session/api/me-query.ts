import { skipToken, useQuery } from '@tanstack/react-query';
import type { ImageSourcePropType } from 'react-native';
import { apiRequest } from '@shared/api';
import type { SessionUser } from '../model/session';
import { useSessionStore } from '../model/session-store';

export const meKeys = {
  all: ['me'] as const,
};

/** GET /users/me — профиль вошедшего (родителя или ребёнка). */
export function fetchMe() {
  return apiRequest<SessionUser>('/users/me');
}

/**
 * Профиль вошедшего: сразу из сессии (что пришло при входе), затем свежий с
 * сервера — имя или аватар могли поменяться с другого устройства.
 */
export function useMe() {
  const session = useSessionStore((state) => state.session);
  const { data } = useQuery({
    queryKey: meKeys.all,
    queryFn: session ? fetchMe : skipToken,
    placeholderData: session?.user,
    staleTime: 60_000,
  });
  return data ?? session?.user ?? null;
}

/**
 * Аватар вошедшего для `<Image>`: сервер отдаёт его только с токеном. null —
 * фото нет (рисуем букву).
 */
export function useMyAvatar(): ImageSourcePropType | null {
  const me = useMe();
  const token = useSessionStore((state) => state.session?.accessToken);
  if (!me?.avatarUrl) return null;
  return {
    uri: me.avatarUrl,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };
}

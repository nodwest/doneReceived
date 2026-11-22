import { skipToken, useQuery } from '@tanstack/react-query';
import type { ImageSourcePropType } from 'react-native';
import { apiRequest, authorizedImage, queryRoots } from '@shared/api';
import type { SessionUser } from '../model/session';
import { useSessionStore } from '../model/session-store';
import { fetchAccountDeletionPreview } from './auth-api';

export const meKeys = {
  all: queryRoots.me,
  deletionPreview: () => [...meKeys.all, 'deletion-preview'] as const,
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
 * id семьи из профиля: у родителя его также даёт GET /families, но ребёнку
 * этот запрос недоступен. `/users/me` нужен, если в сохранённой сессии поля
 * `family` ещё нет — иначе карта ребёнка не знает, что загружать.
 */
export function useSessionFamilyId() {
  const fromSession = useSessionStore(
    (state) => state.session?.user.family?.id ?? null,
  );
  const me = useMe();
  return fromSession ?? me?.family?.id ?? null;
}

/**
 * Аватар вошедшего для `<Image>`: сервер отдаёт его только с токеном. Адрес с
 * хостом сайта переводим на API (`authorizedImage`), иначе получим 401. null —
 * фото нет (рисуем букву).
 */
export function useMyAvatar(): ImageSourcePropType | null {
  const me = useMe();
  if (!me?.avatarUrl) return null;
  return authorizedImage(me.avatarUrl);
}

/**
 * Условия удаления аккаунта родителя. Ответ меняется вместе с балансами и
 * составом семьи, поэтому кэш не держим: экран удаления всегда спрашивает
 * свежий preview. `enabled` — вошёл родитель; у ребёнка запроса нет.
 */
export function useAccountDeletionPreview(enabled: boolean) {
  return useQuery({
    queryKey: meKeys.deletionPreview(),
    queryFn: enabled ? fetchAccountDeletionPreview : skipToken,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

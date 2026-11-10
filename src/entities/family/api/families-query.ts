import { skipToken, useQuery } from '@tanstack/react-query';
import { PARENT_INVITE_TTL_MS, type ParentInvite } from '../model/family';
import { createParentInvite, fetchMyFamilies } from './families-api';

/** Ключи кэша семей с сервера (не путать с моковыми `familyKeys`). */
export const familiesKeys = {
  all: ['families'] as const,
  mine: () => [...familiesKeys.all, 'mine'] as const,
  parentInvite: (familyId: string | null) =>
    [...familiesKeys.all, familyId, 'parent-invite'] as const,
};

/**
 * Семьи вошедшего родителя. `enabled` — есть сессия: без входа запрос не
 * идёт. Пустой список — семьи ещё нет, приложение открывает Family setup.
 */
export function useMyFamilies(enabled = true) {
  return useQuery({
    queryKey: familiesKeys.mine(),
    queryFn: fetchMyFamilies,
    enabled,
    retry: 1,
  });
}

/**
 * Текущая семья: пока у аккаунта она одна, это первая из GET /families.
 * Сам запрос не шлёт — читает кэш, который держит `root-layout.tsx` (без
 * входа его нет). null — семьи нет или список ещё не пришёл.
 */
export function useCurrentFamily() {
  return useMyFamilies(false).data?.[0] ?? null;
}

const inviteLeft = (invite: ParentInvite | undefined) =>
  invite ? Math.max(new Date(invite.expiresAt).getTime() - Date.now(), 0) : 0;

/**
 * Код приглашения второго родителя. `enabled` — открыта панель «Add family
 * member»: только тогда идёт запрос, без намерения пригласить код не
 * выдаём. Живой код из кэша свежий до своего срока; истёк, пока панель
 * открыта, — запрос повторяется сам, сервер выдаёт новый код.
 */
export function useParentInvite(familyId: string | null, enabled: boolean) {
  const active = !!familyId && enabled;
  return useQuery({
    queryKey: familiesKeys.parentInvite(familyId),
    queryFn: active ? () => createParentInvite(familyId) : skipToken,
    staleTime: (query) => inviteLeft(query.state.data),
    // Перезапрос ровно в момент истечения (с запасом в секунду на часы).
    refetchInterval: (query) =>
      active ? Math.max(inviteLeft(query.state.data) + 1000, 1000) : false,
    gcTime: PARENT_INVITE_TTL_MS,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

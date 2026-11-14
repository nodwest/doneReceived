import { skipToken, useQuery } from '@tanstack/react-query';
import type { ParentInvite } from '../model/family';
import {
  createParentInvite,
  fetchFamilyChildren,
  fetchFamilyDetails,
  fetchFamilyMembers,
  fetchMyFamilies,
  previewFamilyInvite,
} from './families-api';
import { queryRoots } from '@shared/api';

/** Ключи кэша семей с сервера (не путать с моковыми `familyKeys`). */
export const familiesKeys = {
  all: queryRoots.families,
  mine: () => [...familiesKeys.all, 'mine'] as const,
  parentInvite: (familyId: string | null) =>
    [...familiesKeys.all, familyId, 'parent-invite'] as const,
  children: (familyId: string | null) =>
    [...familiesKeys.all, familyId, 'children'] as const,
  members: (familyId: string | null) =>
    [...familiesKeys.all, familyId, 'members'] as const,
  /** Всё о семье: дети, участники, детали — сбрасывать после изменений. */
  family: (familyId: string | null) => [...familiesKeys.all, familyId] as const,
  details: (familyId: string | null) =>
    [...familiesKeys.all, familyId, 'details'] as const,
  invitePreview: (code: string) =>
    [...familiesKeys.all, 'invite-preview', code] as const,
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
 * выдаём. Код не запоминаем: каждое открытие панели спрашивает сервер —
 * пока код не истёк и не использован, он отдаёт тот же, иначе новый (иначе
 * после вступления второго родителя показали бы погашенный код). Истёк,
 * пока панель открыта, — запрос повторяется сам.
 */
export function useParentInvite(familyId: string | null, enabled: boolean) {
  const active = !!familyId && enabled;
  return useQuery({
    queryKey: familiesKeys.parentInvite(familyId),
    queryFn: active ? () => createParentInvite(familyId) : skipToken,
    staleTime: (query) => inviteLeft(query.state.data),
    // Выдача кода (POST): синхронизация данных его не перезапрашивает.
    meta: { sync: false },
    // Перезапрос ровно в момент истечения (с запасом в секунду на часы).
    refetchInterval: (query) =>
      active ? Math.max(inviteLeft(query.state.data) + 1000, 1000) : false,
    // Панель закрыли — код забываем, следующее открытие спросит сервер.
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

/**
 * Участники семьи с сервера (родители и дети); без семьи (null) запроса нет.
 * Ребёнку ручка закрыта — у него передавайте null.
 */
export function useFamilyMembers(familyId: string | null) {
  return useQuery({
    queryKey: familiesKeys.members(familyId),
    queryFn: familyId ? () => fetchFamilyMembers(familyId) : skipToken,
  });
}

/**
 * Семья целиком для экрана Family (только родителям); без семьи (null)
 * запроса нет.
 */
export function useFamilyDetails(familyId: string | null) {
  return useQuery({
    queryKey: familiesKeys.details(familyId),
    queryFn: familyId ? () => fetchFamilyDetails(familyId) : skipToken,
  });
}

/** Дети семьи с сервера; без семьи (null) запроса нет. */
export function useFamilyChildren(familyId: string | null) {
  return useQuery({
    queryKey: familiesKeys.children(familyId),
    queryFn: familyId ? () => fetchFamilyChildren(familyId) : skipToken,
  });
}

/**
 * Семья по введённому целиком коду второго родителя; без кода (null) запроса
 * нет. Каждый неверный код — попытка из лимита, поэтому ответ по этому коду
 * держим в кэше и повторно не спрашиваем.
 */
export function useFamilyInvitePreview(code: string | null) {
  return useQuery({
    queryKey: familiesKeys.invitePreview(code ?? ''),
    queryFn: code ? () => previewFamilyInvite(code) : skipToken,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

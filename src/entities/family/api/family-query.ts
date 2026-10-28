import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import { fetchFamilyInvite, fetchInviteCodes } from './family-api';

/** Ключи кэша данных семьи. */
export const familyKeys = {
  all: ['family'] as const,
  inviteCodes: () => [...familyKeys.all, 'invite-codes'] as const,
  invite: (code: string | null) => [...familyKeys.all, 'invite', code] as const,
};

export const inviteCodesQueryOptions = () =>
  queryOptions({
    queryKey: familyKeys.inviteCodes(),
    queryFn: fetchInviteCodes,
  });

/** Коды приглашения в семью: для родителя и для ребёнка. */
export function useInviteCodes() {
  return useQuery(inviteCodesQueryOptions());
}

/** Семья по коду приглашения; без кода (null) запрос не идёт. */
export function useFamilyInvite(code: string | null) {
  return useQuery({
    queryKey: familyKeys.invite(code),
    queryFn: code ? () => fetchFamilyInvite(code) : skipToken,
  });
}

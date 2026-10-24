import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchInviteCodes } from './family-api';

/** Ключи кэша данных семьи. */
export const familyKeys = {
  all: ['family'] as const,
  inviteCodes: () => [...familyKeys.all, 'invite-codes'] as const,
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

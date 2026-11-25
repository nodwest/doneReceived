import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import { fetchParentFunds } from './parent-funds-api';
import { fetchParentPaidTotal } from './parent-wallet-api';
import { fetchChildWallet } from './wallet-api';
import {
  isAccessDenied,
  isApiError,
  privateReadOptions,
  queryRoots,
  usePrivateReadScope,
} from '@shared/api';
import { fetchChildBalance } from './child-wallet-api';

/** Ключи кэша кошелька. */
export const walletKeys = {
  all: queryRoots.wallet,
  child: (childId: string) => [...walletKeys.all, 'child', childId] as const,
  funds: (familyId: string | null) =>
    [...walletKeys.all, 'funds', familyId] as const,
  paidTotal: (familyId: string | null, parentId: string | null) =>
    [...walletKeys.all, 'paid-total', familyId, parentId] as const,
};

export const childWalletQueryOptions = (
  childId: string | null,
  familyId: string | null = null,
) =>
  queryOptions({
    queryKey: walletKeys.child(childId ?? ''),
    queryFn: childId ? () => fetchChildWallet(childId, familyId) : skipToken,
  });

/**
 * Кошелёк ребёнка: баланс, награды за задания и выводы, сначала новые.
 * `childId` — моковый (число строкой) или с сервера (UUID, нужна семья);
 * null — ребёнок ещё не известен, запроса нет.
 */
export function useChildWallet(
  childId: string | null,
  familyId: string | null = null,
) {
  return useQuery(childWalletQueryOptions(childId, familyId));
}

/** Баланс ребёнка; пока кошелёк грузится — isPending. */
export function useChildBalance(
  childId: string | null,
  familyId: string | null = null,
) {
  const scope = usePrivateReadScope();
  const enabled = !!scope && !!familyId && !!childId;
  const { data, error, isPending } = useQuery({
    ...privateReadOptions,
    queryKey: [...walletKeys.all, 'child-balance', scope, familyId, childId],
    queryFn: enabled
      ? ({ signal }) => fetchChildBalance(familyId, childId, signal)
      : skipToken,
  });
  const unavailable =
    isAccessDenied(error) || (isApiError(error) && error.status === 404);
  return {
    balance: unavailable ? 0 : (data ?? 0),
    isPending: enabled && isPending,
  };
}

/**
 * Деньги вошедшего родителя с сервера: всё, резерв и доступное на новые
 * задания. Без семьи (null) запроса нет.
 */
export function useParentFunds(familyId: string | null) {
  return useQuery({
    queryKey: walletKeys.funds(familyId),
    queryFn: familyId ? () => fetchParentFunds(familyId) : skipToken,
  });
}

/** Выплачено родителю за всё время; без parentId — вошедшему. */
export function useParentPaidTotal(
  familyId: string | null,
  parentId: string | null = null,
) {
  return useQuery({
    queryKey: walletKeys.paidTotal(familyId, parentId),
    queryFn:
      familyId && parentId
        ? () => fetchParentPaidTotal(familyId, parentId)
        : skipToken,
  });
}

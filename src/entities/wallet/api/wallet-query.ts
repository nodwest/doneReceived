import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import { fetchParentFunds } from './parent-funds-api';
import { fetchParentPaidTotal } from './parent-wallet-api';
import { fetchChildWallet, fetchWallet } from './wallet-api';
import { queryRoots } from '@shared/api';

/** Ключи кэша кошелька. */
export const walletKeys = {
  all: queryRoots.wallet,
  detail: (familyId: string | null) =>
    [...walletKeys.all, 'detail', familyId] as const,
  child: (childId: string) => [...walletKeys.all, 'child', childId] as const,
  funds: (familyId: string | null) =>
    [...walletKeys.all, 'funds', familyId] as const,
  paidTotal: (familyId: string | null, parentId: string | null) =>
    [...walletKeys.all, 'paid-total', familyId, parentId] as const,
};

export const walletQueryOptions = (familyId: string | null) =>
  queryOptions({
    queryKey: walletKeys.detail(familyId),
    queryFn: () => fetchWallet(familyId),
  });

export const childWalletQueryOptions = (
  childId: string | null,
  familyId: string | null = null,
) =>
  queryOptions({
    queryKey: walletKeys.child(childId ?? ''),
    queryFn: childId ? () => fetchChildWallet(childId, familyId) : skipToken,
  });

/**
 * Кошелёк вошедшего родителя: баланс и транзакции, сначала новые. С семьёй —
 * с сервера, без неё (null) — моки.
 */
export function useWallet(familyId: string | null) {
  return useQuery(walletQueryOptions(familyId));
}

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
  const { data, isPending } = useChildWallet(childId, familyId);
  return { balance: data?.balance ?? 0, isPending: !!childId && isPending };
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

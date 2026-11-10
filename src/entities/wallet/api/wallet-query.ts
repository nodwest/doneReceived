import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import { fetchParentFunds } from './parent-funds-api';
import { fetchChildWallet, fetchWallet } from './wallet-api';

/** Ключи кэша кошелька. */
export const walletKeys = {
  all: ['wallet'] as const,
  detail: () => [...walletKeys.all, 'detail'] as const,
  child: (childId: number) => [...walletKeys.all, 'child', childId] as const,
  funds: (familyId: string | null) =>
    [...walletKeys.all, 'funds', familyId] as const,
};

export const walletQueryOptions = () =>
  queryOptions({ queryKey: walletKeys.detail(), queryFn: fetchWallet });

export const childWalletQueryOptions = (childId: number) =>
  queryOptions({
    queryKey: walletKeys.child(childId),
    queryFn: () => fetchChildWallet(childId),
  });

/** Кошелёк вошедшего родителя: баланс и транзакции, сначала новые. */
export function useWallet() {
  return useQuery(walletQueryOptions());
}

/** Кошелёк ребёнка: баланс, награды за задания и выводы, сначала новые. */
export function useChildWallet(childId: number) {
  return useQuery(childWalletQueryOptions(childId));
}

/** Баланс ребёнка; пока кошелёк грузится — isPending. */
export function useChildBalance(childId: number) {
  const { data, isPending } = useChildWallet(childId);
  return { balance: data?.balance ?? 0, isPending };
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

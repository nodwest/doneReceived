import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchWallet } from './wallet-api';

/** Ключи кэша кошелька. */
export const walletKeys = {
  all: ['wallet'] as const,
  detail: () => [...walletKeys.all, 'detail'] as const,
};

export const walletQueryOptions = () =>
  queryOptions({ queryKey: walletKeys.detail(), queryFn: fetchWallet });

/** Кошелёк вошедшего родителя: баланс и транзакции, сначала новые. */
export function useWallet() {
  return useQuery(walletQueryOptions());
}

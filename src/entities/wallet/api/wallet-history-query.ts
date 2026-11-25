import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
  isAccessDenied,
  isApiError,
  privateReadOptions,
  usePrivateReadScope,
} from '@shared/api';
import { addDays, startOfDay } from '@shared/lib';
import {
  skipToken,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchChildTransactionPage } from './child-wallet-api';
import { fetchParentTransactionPage } from './parent-wallet-api';
import { walletKeys } from './wallet-query';
import { mergeWalletPages, nextWalletCursor } from './wallet-history-pages';

type Page<T> = { transactions: T[]; next?: string | null; balance: number };
type PageRequest<T> = (
  limit: number,
  before: string | undefined,
  signal: AbortSignal,
) => Promise<Page<T>>;

const isWalletUnavailable = (error: unknown) =>
  isAccessDenied(error) || (isApiError(error) && error.status === 404);

function useWalletPages<T extends { id: string; at: string }>(
  familyId: string | null,
  childId: string | null,
  request: PageRequest<T> | undefined,
) {
  const scope = usePrivateReadScope();
  const client = useQueryClient();
  const queryKey = useMemo(
    () => [...walletKeys.all, 'history', scope, familyId, childId] as const,
    [scope, familyId, childId],
  );
  const query = useInfiniteQuery({
    ...privateReadOptions,
    queryKey,
    queryFn:
      scope && request
        ? ({ pageParam, signal }) => request(20, pageParam, signal)
        : skipToken,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last, _pages, _previous, cursors) =>
      nextWalletCursor(last.next, cursors),
    gcTime: 30_000,
    staleTime: 60_000,
  });
  const unavailable = isWalletUnavailable(query.error);
  const data = unavailable ? undefined : query.data;
  const transactions = useMemo(
    () => mergeWalletPages(data?.pages ?? []),
    [data],
  );
  const last = data?.pages.at(-1);
  const invalidCursor = !!last?.next && !!data?.pageParams.includes(last.next);
  useEffect(() => {
    if (unavailable)
      client
        .getQueryCache()
        .find({ queryKey, exact: true })
        ?.setState({ data: undefined });
  }, [client, queryKey, unavailable]);
  const refreshing = useRef(false);
  const refresh = async () => {
    if (!scope || !request || refreshing.current) return;
    const filters = { queryKey, exact: true };
    const cached = client.getQueryCache().find(filters);
    if (!cached) return;
    refreshing.current = true;
    try {
      await client.cancelQueries(filters);
      if (client.getQueryCache().find(filters) !== cached || !cached.isActive())
        return;
      client.setQueryData(
        queryKey,
        (current: typeof data) =>
          current && {
            pages: current.pages.slice(0, 1),
            pageParams: current.pageParams.slice(0, 1),
          },
      );
      await query.refetch({ cancelRefetch: false });
    } finally {
      refreshing.current = false;
    }
  };
  return {
    key: JSON.stringify(queryKey),
    transactions,
    oldestAt: transactions.at(-1)?.at,
    balance: data?.pages[0]?.balance ?? 0,
    hasNext: !unavailable && query.hasNextPage,
    invalidCursor:
      invalidCursor || (isApiError(query.error) && query.error.status === 400),
    isFetching: query.isFetching,
    isLoading: !!scope && !!request && query.isPending,
    isError: query.isError,
    isPageError: query.isFetchNextPageError,
    loadMore: () => {
      if (
        !query.hasNextPage ||
        query.isFetching ||
        refreshing.current ||
        unavailable
      )
        return;
      void query.fetchNextPage({ cancelRefetch: false });
    },
    refresh,
  };
}

export function useParentTransactionHistory(familyId: string | null) {
  return useWalletPages(
    familyId,
    null,
    familyId
      ? (limit, before, signal) =>
          fetchParentTransactionPage(familyId, limit, before, signal)
      : undefined,
  );
}

export function useChildTransactionHistory(
  familyId: string | null,
  childId: string | null,
) {
  return useWalletPages(
    familyId,
    childId,
    familyId && childId
      ? (limit, before, signal) =>
          fetchChildTransactionPage(familyId, childId, limit, before, signal)
      : undefined,
  );
}

function useToday() {
  const [day, setDay] = useState(() => startOfDay(new Date()).getTime());
  useFocusEffect(
    useCallback(() => {
      let timer: ReturnType<typeof setTimeout>;
      const update = () => {
        clearTimeout(timer);
        const now = new Date();
        const today = startOfDay(now);
        setDay(today.getTime());
        timer = setTimeout(
          update,
          Math.min(60_000, addDays(today, 1).getTime() - now.getTime()),
        );
      };
      update();
      const subscription = AppState.addEventListener('change', (state) => {
        if (state === 'active') update();
      });
      return () => {
        subscription.remove();
        clearTimeout(timer);
      };
    }, []),
  );
  return day;
}

function useRecentWallet<T extends { at: string }>(
  familyId: string | null,
  childId: string | null,
  request: PageRequest<T> | undefined,
) {
  const scope = usePrivateReadScope();
  const today = useToday();
  const tomorrow = addDays(new Date(today), 1).getTime();
  const query = useQuery({
    ...privateReadOptions,
    queryKey: [...walletKeys.all, 'recent', scope, familyId, childId, today],
    queryFn:
      scope && request
        ? ({ signal }) => request(6, undefined, signal)
        : skipToken,
    gcTime: 30_000,
  });
  const wallet = isWalletUnavailable(query.error) ? undefined : query.data;
  const transactions =
    wallet?.transactions.filter((item) => {
      const time = Date.parse(item.at);
      return time >= today && time < tomorrow;
    }) ?? [];
  return { ...query, data: wallet, transactions };
}

export function useRecentParentWallet(familyId: string | null) {
  return useRecentWallet(
    familyId,
    null,
    familyId
      ? (limit, before, signal) =>
          fetchParentTransactionPage(familyId, limit, before, signal)
      : undefined,
  );
}

export function useRecentChildWallet(
  familyId: string | null,
  childId: string | null,
) {
  return useRecentWallet(
    familyId,
    childId,
    familyId && childId
      ? (limit, before, signal) =>
          fetchChildTransactionPage(familyId, childId, limit, before, signal)
      : undefined,
  );
}

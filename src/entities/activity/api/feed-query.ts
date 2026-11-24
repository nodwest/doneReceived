import { useEffect, useMemo } from 'react';
import { skipToken, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { FeedViewer } from '../model/feed';
import {
  fetchFeed,
  mergeFeedPages,
  presentFeed,
  type FeedChildLabel,
  type FeedMemberLabel,
} from './feed-api';
import { addDays, startOfDay } from '@shared/lib';
import {
  queryRoots,
  privateReadOptions,
  usePrivateReadScope,
  isAccessDenied,
} from '@shared/api';

/**
 * Сколько последних событий берём для ленты на главной. Из них получаются
 * карточки: у задания одна карточка со всей историей, поэтому событий нужно
 * заметно больше, чем карточек, — берём максимум сервера, чтобы в истории
 * были и первые шаги.
 */
export const FEED_LIMIT = 100;

export const feedKeys = {
  all: queryRoots.activity,
  list: (
    familyId: string | null,
    userId: string | null,
    childId?: string,
    scope?: string | null,
  ) => [...feedKeys.all, familyId, userId, childId, scope] as const,
  history: (
    familyId: string | null,
    userId: string | null,
    childId?: string,
    scope?: string | null,
  ) => [...feedKeys.all, 'history', familyId, userId, childId, scope] as const,
};

/**
 * Лента событий семьи на главной; без смотрящего (null) запроса нет.
 * События с других устройств приходят событиями сервера (`syncData`).
 */
export function useFeed(
  viewer: FeedViewer | null,
  children?: readonly FeedChildLabel[],
  members?: readonly FeedMemberLabel[],
) {
  const scope = usePrivateReadScope();
  const query = useQuery({
    ...privateReadOptions,
    queryKey: feedKeys.list(
      viewer?.familyId ?? null,
      viewer?.userId ?? null,
      viewer?.child?.id,
      scope,
    ),
    queryFn: viewer
      ? ({ signal }) => fetchFeed(viewer.familyId, FEED_LIMIT, signal)
      : skipToken,
  });
  const data = useMemo(
    () =>
      query.data && viewer
        ? presentFeed(query.data, viewer, members, children)
        : undefined,
    [query.data, viewer, members, children],
  );
  const accessDenied = isAccessDenied(query.error);
  return { ...query, accessDenied, data: accessDenied ? undefined : data };
}

/** За сколько дней, считая сегодняшний, показывает события страница Activity. */
const HISTORY_DAYS = 30;

/** С какого момента события попадают на страницу Activity. */
export const feedHistoryStart = () =>
  addDays(startOfDay(new Date()), 1 - HISTORY_DAYS);

/**
 * События за последние 30 дней для страницы Activity. Фильтра по датам на
 * сервере нет: страницы ленты загружаются одна за другой, пока не дойдём до
 * начала периода. Уже загруженное видно сразу.
 */
export function useFeedHistory(
  viewer: FeedViewer | null,
  children?: readonly FeedChildLabel[],
  members?: readonly FeedMemberLabel[],
) {
  const scope = usePrivateReadScope();
  const query = useInfiniteQuery({
    ...privateReadOptions,
    queryKey: feedKeys.history(
      viewer?.familyId ?? null,
      viewer?.userId ?? null,
      viewer?.child?.id,
      scope,
    ),
    queryFn: viewer
      ? ({ signal, pageParam }) =>
          fetchFeed(viewer.familyId, FEED_LIMIT, signal, pageParam)
      : skipToken,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: ({ activity }) => {
      const oldest = activity.items[activity.items.length - 1];
      return activity.next &&
        oldest &&
        new Date(oldest.createdAt) >= feedHistoryStart()
        ? activity.next
        : undefined;
    },
  });
  const { hasNextPage, isFetching, isError, fetchNextPage } = query;
  useEffect(() => {
    if (hasNextPage && !isFetching && !isError) void fetchNextPage();
  }, [hasNextPage, isFetching, isError, fetchNextPage]);

  const data = useMemo(
    () =>
      query.data && viewer
        ? presentFeed(
            mergeFeedPages(query.data.pages),
            viewer,
            members,
            children,
          )
        : undefined,
    [query.data, viewer, members, children],
  );
  const accessDenied = isAccessDenied(query.error);
  return { ...query, accessDenied, data: accessDenied ? undefined : data };
}

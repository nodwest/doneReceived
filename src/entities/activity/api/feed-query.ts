import { useMemo } from 'react';
import {
  skipToken,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { FeedViewer } from '../model/feed';
import { fetchSubmissionComments } from './comments-api';
import {
  fetchFeed,
  fetchFeedHistoryPage,
  mergeFeedPages,
  presentFeed,
  type FeedChildLabel,
  type FeedHistoryCursor,
  type FeedMemberLabel,
} from './feed-api';
import { addDays, startOfDay } from '@shared/lib';
import {
  queryRoots,
  privateReadOptions,
  usePrivateReadScope,
  isAccessDenied,
  isApiError,
} from '@shared/api';

const FEED_PAGE_SIZE = 20;

export const feedKeys = {
  all: queryRoots.activity,
  list: (
    familyId: string | null,
    userId: string | null,
    childId?: string,
    scope?: string | null,
  ) => [...feedKeys.all, familyId, userId, childId, scope] as const,
  comments: (
    familyId: string,
    assignmentId: string | null,
    scope?: string | null,
  ) => [...feedKeys.all, 'comments', familyId, assignmentId, scope] as const,
  history: (
    familyId: string | null,
    userId: string | null,
    scope: string | null,
    since: string,
    childId: string | undefined,
    viewerChildId: string | undefined,
  ) =>
    [
      ...feedKeys.all,
      'history',
      familyId,
      userId,
      scope,
      since,
      childId,
      viewerChildId,
    ] as const,
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
    queryFn:
      viewer && scope
        ? ({ signal }) => fetchFeed(viewer.familyId, FEED_PAGE_SIZE, signal)
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
 * События за последние 30 дней для страницы Activity. Следующую страницу
 * запрашивает экран при прокрутке или по кнопке.
 */
export function useFeedHistory(
  viewer: FeedViewer | null,
  children?: readonly FeedChildLabel[],
  members?: readonly FeedMemberLabel[],
  selectedChildId?: string,
) {
  const scope = usePrivateReadScope();
  const client = useQueryClient();
  const since = feedHistoryStart().toISOString();
  const previewKey = feedKeys.list(
    viewer?.familyId ?? null,
    viewer?.userId ?? null,
    viewer?.child?.id,
    scope,
  );
  const preview =
    viewer && scope && !selectedChildId
      ? client.getQueryState<Awaited<ReturnType<typeof fetchFeed>>>(previewKey)
      : undefined;
  const queryKey = feedKeys.history(
    viewer?.familyId ?? null,
    viewer?.userId ?? null,
    scope,
    since,
    selectedChildId,
    viewer?.child?.id,
  );
  const query = useInfiniteQuery({
    ...privateReadOptions,
    queryKey,
    gcTime: 30_000,
    queryFn:
      viewer && scope
        ? ({ signal, pageParam }) =>
            fetchFeedHistoryPage(
              viewer.familyId,
              FEED_PAGE_SIZE,
              signal,
              { since, childId: selectedChildId },
              pageParam,
            )
        : skipToken,
    // The preview is unfiltered. Its cursor cannot continue a history query.
    placeholderData:
      preview?.status === 'success' && !preview.isInvalidated && preview.data
        ? {
            pages: [
              {
                ...preview.data,
                legacy: false,
                activity: {
                  items: preview.data.activity.items.filter(
                    (item) => Date.parse(item.createdAt) >= Date.parse(since),
                  ),
                },
              },
            ],
            pageParams: [undefined],
          }
        : undefined,
    initialPageParam: undefined as FeedHistoryCursor | undefined,
    getNextPageParam: ({ activity, legacy }, _pages, _previous, cursors) => {
      return activity.next &&
        !cursors.some((cursor) => cursor?.before === activity.next)
        ? { before: activity.next, legacy }
        : undefined;
    },
  });
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
  const retry = () => {
    if (query.isFetching || accessDenied || !viewer || !scope) return;
    if (!query.isFetchNextPageError) {
      void query.refetch({ cancelRefetch: false });
    } else if (isApiError(query.error) && query.error.status === 400) {
      // Restart this scoped list instead of retrying an invalid cursor.
      void client.resetQueries({ queryKey, exact: true });
    } else {
      void query.fetchNextPage({ cancelRefetch: false });
    }
  };
  return {
    ...query,
    accessDenied,
    retry,
    data: accessDenied ? undefined : data,
  };
}

/**
 * Комментарии к истории задания. Запрос — только когда карточку раскрыли
 * (`enabled`): статусы видны сразу, комментарии появляются следом.
 */
export function useSubmissionComments(
  familyId: string,
  assignmentId: string | null,
  enabled: boolean,
) {
  const scope = usePrivateReadScope();
  return useQuery({
    ...privateReadOptions,
    queryKey: feedKeys.comments(familyId, assignmentId, scope),
    queryFn:
      scope && assignmentId && enabled
        ? ({ signal }) =>
            fetchSubmissionComments(familyId, assignmentId, signal)
        : skipToken,
  });
}

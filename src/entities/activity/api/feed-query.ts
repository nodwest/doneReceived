import { useMemo } from 'react';
import { skipToken, useQuery } from '@tanstack/react-query';
import type { FeedViewer } from '../model/feed';
import {
  fetchFeed,
  presentFeed,
  type FeedChildLabel,
  type FeedMemberLabel,
} from './feed-api';
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

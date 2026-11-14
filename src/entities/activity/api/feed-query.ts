import { skipToken, useQuery } from '@tanstack/react-query';
import type { FeedViewer } from '../model/feed';
import { fetchFeed } from './feed-api';
import { queryRoots, SYNC_POLL_MS } from '@shared/api';

/** Сколько последних событий показывает лента на главной. */
export const FEED_LIMIT = 5;

export const feedKeys = {
  all: queryRoots.activity,
  list: (familyId: string | null, userId: string | null) =>
    [...feedKeys.all, familyId, userId] as const,
};

/**
 * Лента событий семьи на главной; без смотрящего (null) запроса нет.
 * Событие может прийти с другого устройства — перечитываем раз в 15 с.
 */
export function useFeed(viewer: FeedViewer | null) {
  return useQuery({
    queryKey: feedKeys.list(viewer?.familyId ?? null, viewer?.userId ?? null),
    queryFn: viewer ? () => fetchFeed(viewer, FEED_LIMIT) : skipToken,
    refetchInterval: viewer ? SYNC_POLL_MS : false,
  });
}

import { apiRequest, authorizedImage } from '@shared/api';
import type { FeedEvent, FeedEventType, FeedViewer } from '../model/feed';

type ActivityDto = {
  items: {
    id: string;
    type: FeedEventType;
    createdAt: string;
    actorId: string | null;
    childId: string | null;
    assignmentId: string | null;
    taskTitle: string | null;
    points: number | null;
  }[];
  /** Курсор следующей, более старой страницы; null — её нет. */
  next?: string | null;
};

export type FeedMemberLabel = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
};

export type FeedChildLabel = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
};

type MissedDto = {
  items: { assignmentId: string; reason: 'expired' | 'rejected' }[];
};

/**
 * Назначения, закрытые отказом без переделки, у детей с событиями
 * task_rejected: в событии ленты нет `retry`, а в missed-tasks такие есть.
 * Не ответили — считаем отказ возвратом на переделку.
 */
async function fetchClosedAssignments(
  familyId: string,
  items: ActivityDto['items'],
  signal: AbortSignal,
): Promise<Set<string>> {
  const childIds = [
    ...new Set(
      items
        .filter((item) => item.type === 'task_rejected' && item.childId)
        .map((item) => item.childId as string),
    ),
  ];
  const lists = await Promise.all(
    childIds.map((childId) =>
      apiRequest<MissedDto>(
        `/families/${familyId}/children/${childId}/missed-tasks`,
        { signal, timeoutMs: 5_000 },
      ).catch(() => ({ items: [] }) as MissedDto),
    ),
  );
  return new Set(
    lists.flatMap((list) =>
      list.items
        .filter((item) => item.reason === 'rejected')
        .map((item) => item.assignmentId),
    ),
  );
}

const KNOWN: readonly FeedEventType[] = [
  'task_created',
  'task_submitted',
  'task_withdrawn',
  'task_approved',
  'task_rejected',
  'task_cancelled',
  'task_expired',
  'wish_added',
  'deposit',
  'event_created',
  'event_updated',
  'event_cancelled',
];

/** Нет более позднего отказа по тому же назначению (лента — новые первыми). */
const isLastRejection = (
  items: ActivityDto['items'],
  item: ActivityDto['items'][number],
) =>
  !items.some(
    (other) =>
      other !== item &&
      other.type === 'task_rejected' &&
      other.assignmentId === item.assignmentId &&
      other.createdAt > item.createdAt,
  );

export async function fetchFeed(
  familyId: string,
  limit: number,
  signal: AbortSignal,
  before?: string,
) {
  const cursor = before ? `&before=${encodeURIComponent(before)}` : '';
  const activity = await apiRequest<ActivityDto>(
    `/families/${familyId}/activity?limit=${limit}${cursor}`,
    { signal },
  );
  const closed = await fetchClosedAssignments(familyId, activity.items, signal);
  return { activity, closed: [...closed] };
}

type FeedPage = Awaited<ReturnType<typeof fetchFeed>>;

/** Страницы ленты одной: новые события первыми, без повторов. */
export function mergeFeedPages(pages: readonly FeedPage[]): FeedPage {
  const items = new Map<string, ActivityDto['items'][number]>();
  for (const page of pages) {
    for (const item of page.activity.items) items.set(item.id, item);
  }
  return {
    activity: { items: [...items.values()] },
    closed: [...new Set(pages.flatMap((page) => page.closed))],
  };
}

export function presentFeed(
  { activity, closed }: FeedPage,
  viewer: FeedViewer,
  members: readonly FeedMemberLabel[] = [],
  children: readonly FeedChildLabel[] = [],
): FeedEvent[] {
  const visibleChildren = viewer.child
    ? [
        {
          id: viewer.child.id,
          displayName: viewer.child.name,
          avatarUrl: viewer.child.avatarUrl,
        },
      ]
    : children;
  const photo = (url: string | null | undefined) =>
    url ? authorizedImage(url) : null;
  const result = activity.items
    .filter((item) => KNOWN.includes(item.type))
    .map((item) => {
      const member = members.find((entry) => entry.userId === item.actorId);
      const byMe = item.actorId === viewer.userId;
      const child = visibleChildren.find((entry) => entry.id === item.childId);
      return {
        id: item.id,
        // Закрывающий отказ — последний по назначению: после него событий
        // по нему не бывает, поэтому любой task_rejected закрытого — закрытие.
        type:
          item.type === 'task_rejected' &&
          item.assignmentId &&
          closed.includes(item.assignmentId) &&
          isLastRejection(activity.items, item)
            ? ('task_closed' as const)
            : item.type,
        at: item.createdAt,
        assignmentId: item.assignmentId,
        title: item.taskTitle,
        points: item.points,
        childId: item.childId,
        child: child
          ? { name: child.displayName, avatar: photo(child.avatarUrl) }
          : null,
        // Ребёнок сам — актёр своих событий: его имя есть и без участников.
        actor: {
          name: member?.displayName ?? (byMe ? viewer.child?.name : null) ?? '',
          avatar: photo(
            member?.avatarUrl ?? (byMe ? viewer.child?.avatarUrl : null),
          ),
        },
        byMe,
      };
    });
  return result;
}

import { ApiError, apiRequest, authorizedImage } from '@shared/api';
import { withTimeout } from '@shared/lib';
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
};

type MemberDto = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
};

type ChildDto = { id: string; displayName: string; avatarUrl: string | null };

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

/**
 * GET /families/:id/activity — последние события семьи (ребёнку — только
 * его), новые первыми. Имена: родители — из участников семьи, дети — из
 * списка детей (ребёнку он закрыт: его имя и фото из профиля); фото — с
 * токеном, нет фото — буква. Незнакомые типы событий пропускаем.
 */
export async function fetchFeed(
  viewer: FeedViewer,
  limit: number,
): Promise<FeedEvent[]> {
  const { familyId } = viewer;
  const [activity, members, children] = await Promise.all([
    // Сервер иногда «подвисает» на ленте: не ждём бесконечно, иначе главная
    // навсегда остаётся без истории. Не ответил — запрос падает, и виджет
    // показывает «Повторить».
    withTimeout<ActivityDto | null>(
      apiRequest<ActivityDto>(`/families/${familyId}/activity?limit=${limit}`),
      null,
      15_000,
    ),
    // Имена и фото — необязательная подпись. Зависший /members не должен
    // держать всю ленту: не ответил за отведённое время — показываем без имён.
    withTimeout(
      apiRequest<MemberDto[]>(`/families/${familyId}/members`),
      [] as MemberDto[],
    ),
    viewer.child
      ? ([
          {
            id: viewer.child.id,
            displayName: viewer.child.name,
            avatarUrl: viewer.child.avatarUrl,
          },
        ] as ChildDto[])
      : withTimeout(
          apiRequest<ChildDto[]>(`/families/${familyId}/children`),
          [] as ChildDto[],
        ),
  ]);
  if (!activity) throw new ApiError(0, []);
  // Закрытые отказом без переделки — только уточнение статуса; без него
  // показываем отказ как возврат на доработку.
  const closed = await withTimeout(
    fetchClosedAssignments(familyId, activity.items),
    new Set<string>(),
  );
  const photo = (url: string | null | undefined) =>
    url ? authorizedImage(url) : null;
  const result = activity.items
    .filter((item) => KNOWN.includes(item.type))
    .map((item) => {
      const member = members.find((entry) => entry.userId === item.actorId);
      const byMe = item.actorId === viewer.userId;
      const child = children.find((entry) => entry.id === item.childId);
      return {
        id: item.id,
        // Закрывающий отказ — последний по назначению: после него событий
        // по нему не бывает, поэтому любой task_rejected закрытого — закрытие.
        type:
          item.type === 'task_rejected' &&
          item.assignmentId &&
          closed.has(item.assignmentId) &&
          isLastRejection(activity.items, item)
            ? ('task_closed' as const)
            : item.type,
        at: item.createdAt,
        assignmentId: item.assignmentId,
        title: item.taskTitle,
        points: item.points,
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

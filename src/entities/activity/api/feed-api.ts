import { apiRequest } from '@shared/api';
import type { FeedEvent, FeedEventType, FeedViewer } from '../model/feed';

type ActivityDto = {
  items: {
    id: string;
    type: FeedEventType;
    createdAt: string;
    actorId: string;
    childId: string | null;
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

const KNOWN: readonly FeedEventType[] = [
  'task_created',
  'task_submitted',
  'task_withdrawn',
  'task_approved',
  'task_rejected',
  'task_cancelled',
  'wish_added',
  'deposit',
];

/**
 * GET /families/:id/activity — последние события семьи (ребёнку — только
 * его), новые первыми. Имена: родители — из участников семьи, дети — из
 * списка детей (ребёнку он закрыт: его имя из сессии). Фото с сервера
 * требуют токен — пока показываем букву. Незнакомые типы событий пропускаем.
 */
export async function fetchFeed(
  viewer: FeedViewer,
  limit: number,
): Promise<FeedEvent[]> {
  const { familyId } = viewer;
  const [activity, members, children] = await Promise.all([
    apiRequest<ActivityDto>(`/families/${familyId}/activity?limit=${limit}`),
    apiRequest<MemberDto[]>(`/families/${familyId}/members`).catch(
      () => [] as MemberDto[],
    ),
    viewer.child
      ? ([
          { id: viewer.child.id, displayName: viewer.child.name },
        ] as ChildDto[])
      : apiRequest<ChildDto[]>(`/families/${familyId}/children`).catch(
          () => [] as ChildDto[],
        ),
  ]);
  const childName = (id: string | null) =>
    children.find((child) => child.id === id)?.displayName ?? null;
  return activity.items
    .filter((item) => KNOWN.includes(item.type))
    .map((item) => {
      const member = members.find((entry) => entry.userId === item.actorId);
      const byMe = item.actorId === viewer.userId;
      const child = childName(item.childId);
      return {
        id: item.id,
        type: item.type,
        at: item.createdAt,
        title: item.taskTitle,
        points: item.points,
        child: child ? { name: child, avatar: null } : null,
        // Ребёнок сам — актёр своих событий: его имя есть и без участников.
        actor: {
          name: member?.displayName ?? (byMe ? viewer.child?.name : null) ?? '',
          avatar: null,
        },
        byMe,
      };
    });
}

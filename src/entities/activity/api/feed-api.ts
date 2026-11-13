import { apiRequest, authorizedImage } from '@shared/api';
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
 * списка детей (ребёнку он закрыт: его имя и фото из профиля); фото — с
 * токеном, нет фото — буква. Незнакомые типы событий пропускаем.
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
          {
            id: viewer.child.id,
            displayName: viewer.child.name,
            avatarUrl: viewer.child.avatarUrl,
          },
        ] as ChildDto[])
      : apiRequest<ChildDto[]>(`/families/${familyId}/children`).catch(
          () => [] as ChildDto[],
        ),
  ]);
  const photo = (url: string | null | undefined) =>
    url ? authorizedImage(url) : null;
  return activity.items
    .filter((item) => KNOWN.includes(item.type))
    .map((item) => {
      const member = members.find((entry) => entry.userId === item.actorId);
      const byMe = item.actorId === viewer.userId;
      const child = children.find((entry) => entry.id === item.childId);
      return {
        id: item.id,
        type: item.type,
        at: item.createdAt,
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
}

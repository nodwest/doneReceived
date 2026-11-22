import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sortTasksByUrgency } from '../model/sort-tasks';
import type {
  TaskChildLabel,
  TaskMemberLabel,
  TaskViewer,
} from './server-tasks-api';
import { fetchTasks } from './tasks-api';
import {
  authorizedImage,
  queryRoots,
  privateReadOptions,
  usePrivateReadScope,
  isAccessDenied,
} from '@shared/api';

/** Ключи кэша задач: мутации инвалидируют taskKeys.all. */
export const taskKeys = {
  all: queryRoots.tasks,
  list: (
    familyId: string | null,
    userId?: string,
    role?: TaskViewer['familyRole'],
    scope?: string | null,
  ) => [...taskKeys.all, 'list', familyId, userId, role, scope] as const,
};

/** В кэше остаются Task[] для оптимистичных обновлений. Подписи задаёт вызывающий слой. */
export function useTasks(
  viewer: TaskViewer | null,
  children?: readonly TaskChildLabel[],
  members?: readonly TaskMemberLabel[],
) {
  const scope = usePrivateReadScope();
  const query = useQuery({
    ...privateReadOptions,
    queryKey: taskKeys.list(
      viewer?.familyId ?? null,
      viewer?.userId,
      viewer?.familyRole,
      scope,
    ),
    queryFn: ({ signal }) => fetchTasks(viewer, signal),
    select: sortTasksByUrgency,
  });
  const data = useMemo(
    () =>
      query.data?.map((task) => {
        const child = children?.find(({ id }) => id === task.assignee.id);
        const author = members?.find(({ userId }) => userId === task.createdBy);
        return {
          ...task,
          assignee: child
            ? {
                id: child.id,
                name: child.displayName,
                avatar: child.avatarUrl
                  ? authorizedImage(child.avatarUrl)
                  : null,
              }
            : {
                ...task.assignee,
                name: viewer?.childName ?? task.assignee.name,
              },
          authorName: author?.displayName,
          authorAvatar: author?.avatarUrl
            ? authorizedImage(author.avatarUrl)
            : null,
          canManage:
            task.canManage ||
            (viewer?.familyRole === 'owner' &&
              members !== undefined &&
              !author),
        };
      }),
    [query.data, children, members, viewer],
  );
  const accessDenied = isAccessDenied(query.error);
  return { ...query, accessDenied, data: accessDenied ? undefined : data };
}

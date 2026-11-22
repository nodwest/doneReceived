import { useMemo } from 'react';
import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';
import { useTasks, type TaskViewer } from '@entities/task';
import { useFamilyLabels, useRecheckFamilyAccess } from './use-family-labels';

/**
 * Кто смотрит задания: семья (у родителя — из GET /families, у ребёнка — из
 * сессии) и его аккаунт. Без семьи — null, тогда только моковые задания.
 * «Свои» задания экраны узнают по `createdBy === userId` (`useMyId`).
 */
export function useTaskViewer(): TaskViewer | null {
  const family = useCurrentFamily();
  const user = useSessionUser();
  const familyId = family?.id ?? user?.family?.id ?? null;
  return useMemo(
    () =>
      familyId && user
        ? {
            familyId,
            userId: user.id,
            familyRole: family?.role ?? user.family?.role,
            childName: user.kind === 'child' ? user.displayName : undefined,
          }
        : null,
    [family?.role, familyId, user],
  );
}

/**
 * Задания для экранов. Вернулись на экран — список перечитывается, как и всё
 * устаревшее (`useRefreshOnNavigate` в `app/providers`).
 */
export function useFamilyTasks() {
  const viewer = useTaskViewer();
  const { children, members, accessDenied } = useFamilyLabels(viewer);
  const query = useTasks(viewer, children, members);
  const denied = accessDenied || query.accessDenied;
  useRecheckFamilyAccess(denied, !!viewer && viewer.childName === undefined);
  return {
    ...query,
    accessDenied: denied,
    data: denied ? undefined : query.data,
  };
}

/** Семья для запросов заданий (создание, правка, отмена). */
export function useTaskFamilyId() {
  return useTaskViewer()?.familyId ?? null;
}

/**
 * Задания ребёнка для его экранов: сервер отдаёт вошедшему ребёнку только его
 * назначения. У родителя экранов ребёнка нет — пустой список.
 */
export function useChildTasks() {
  const user = useSessionUser();
  const { data, isPending } = useFamilyTasks();
  const childSession = user?.kind === 'child';
  const tasks = useMemo(
    () => (data && childSession ? data : data && []),
    [data, childSession],
  );
  return { data: tasks, isPending };
}

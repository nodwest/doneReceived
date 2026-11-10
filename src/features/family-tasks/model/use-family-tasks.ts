import { useCallback, useMemo, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';
import { filterTasks, useTasks, type TaskViewer } from '@entities/task';
import { childAccountMock, parentMock } from '@shared/mocks';

/**
 * Кто смотрит задания: семья (у родителя — из GET /families, у ребёнка — из
 * сессии) и его аккаунт. Без семьи — null, тогда только моковые задания.
 * Задания вошедшего родителя помечаются автором моковой Sarah: экраны уже
 * считают «моими» её задания.
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
            ownAuthor: String(parentMock.id),
            childName: user.kind === 'child' ? user.displayName : undefined,
          }
        : null,
    [familyId, user],
  );
}

/**
 * Задания для экранов: моковые и настоящие (с сервера) одним списком. Экран
 * открыли или вернулись на него — список перечитывается (первый показ
 * загружает его и так).
 */
export function useFamilyTasks() {
  const query = useTasks(useTaskViewer());
  const { refetch } = query;
  const shown = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (shown.current) refetch();
      shown.current = true;
    }, [refetch]),
  );
  return query;
}

/** Семья для запросов заданий (создание, правка, отмена). */
export function useTaskFamilyId() {
  return useTaskViewer()?.familyId ?? null;
}

/**
 * Задания ребёнка для его экранов. Вошёл сам ребёнок — его настоящие задания
 * (сервер отдаёт ребёнку только его назначения). Родитель смотрит в режиме
 * ребёнка — моковые задания Emma.
 */
export function useChildTasks() {
  const user = useSessionUser();
  const { data, isPending } = useFamilyTasks();
  const childSession = user?.kind === 'child';
  const tasks = useMemo(() => {
    if (!data) return undefined;
    return childSession
      ? data.filter((task) => task.serverTaskId)
      : filterTasks(data, { assigneeId: String(childAccountMock.id) });
  }, [data, childSession]);
  return { data: tasks, isPending };
}

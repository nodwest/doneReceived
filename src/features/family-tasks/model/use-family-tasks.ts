import { useMemo } from 'react';
import { useCurrentFamily } from '@entities/family';
import { useSessionUser } from '@entities/session';
import { useTasks, type TaskViewer } from '@entities/task';
import { parentMock } from '@shared/mocks';

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

/** Задания для экранов: моковые и настоящие (с сервера) одним списком. */
export function useFamilyTasks() {
  return useTasks(useTaskViewer());
}

/** Семья для запросов заданий (создание, правка, отмена). */
export function useTaskFamilyId() {
  return useTaskViewer()?.familyId ?? null;
}

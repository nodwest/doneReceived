import { useMemo } from 'react';
import { useOperations, type OperationsViewer } from '@entities/operation';
import { useSession } from '@entities/session';
import { useChildBalance, useChildWallet } from '@entities/wallet';
import type { WishlistOwner } from '@entities/wish';
import { useChildTasks, useTaskViewer } from './use-family-tasks';

/**
 * Чей кошелёк на экранах ребёнка. Вошёл сам ребёнок — его профиль на сервере:
 * id из сессии (сохраняется при подключении устройства), у сессий постарше —
 * из его заданий. У родителя экранов ребёнка нет — null.
 */
export function useChildAccount(): {
  childId: string | null;
  familyId: string | null;
} {
  const session = useSession();
  const { data: tasks } = useChildTasks();
  if (session?.user.kind !== 'child') {
    return { childId: null, familyId: null };
  }
  return {
    childId:
      session.childId ??
      tasks?.find((task) => task.serverTaskId)?.assignee.id ??
      null,
    familyId: session.user.family?.id ?? null,
  };
}

/** Кошелёк ребёнка, который смотрит экраны (см. `useChildAccount`). */
export function useMyChildWallet() {
  const { childId, familyId } = useChildAccount();
  return useChildWallet(childId, familyId);
}

/** Баланс ребёнка, который смотрит экраны; пока грузится — isPending. */
export function useMyChildBalance() {
  const { childId, familyId } = useChildAccount();
  return useChildBalance(childId, familyId);
}

/**
 * Чей вишлист на экранах ребёнка (см. `useChildAccount`); null — ребёнок
 * ещё не известен.
 */
export function useMyWishlistOwner(): WishlistOwner | null {
  const { childId, familyId } = useChildAccount();
  return useMemo(
    () => (childId ? { childId, familyId } : null),
    [childId, familyId],
  );
}

/**
 * История наград для экранов, собранная с сервера (начисления из кошельков
 * детей и упущенные). У вошедшего ребёнка — только его.
 */
export function useFamilyOperations() {
  const viewer = useTaskViewer();
  const session = useSession();
  const { childId } = useChildAccount();
  const childSession = session?.user.kind === 'child';
  const operationsViewer = useMemo<OperationsViewer | null>(() => {
    if (!viewer) return null;
    if (!childSession) return viewer;
    // Ребёнок без id профиля — истории с сервера не собрать.
    if (!childId || !session) return null;
    return {
      ...viewer,
      child: { id: childId, name: session.user.displayName },
    };
  }, [viewer, childSession, childId, session]);
  return useOperations(operationsViewer);
}

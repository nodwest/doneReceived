import { useMemo } from 'react';
import { useSession } from '@entities/session';
import { useChildBalance, useChildWallet } from '@entities/wallet';
import type { WishlistOwner } from '@entities/wish';
import { childAccountMock } from '@shared/mocks';
import { useChildTasks } from './use-family-tasks';

/**
 * Чей кошелёк на экранах ребёнка. Вошёл сам ребёнок — его профиль на сервере:
 * id из сессии (сохраняется при подключении устройства), у сессий постарше —
 * из его заданий. Родитель в режиме ребёнка — моковая Emma.
 */
export function useChildAccount() {
  const session = useSession();
  const { data: tasks } = useChildTasks();
  if (session?.user.kind !== 'child') {
    return { childId: String(childAccountMock.id), familyId: null };
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

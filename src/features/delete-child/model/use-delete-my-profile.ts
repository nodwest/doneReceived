import { useMutation } from '@tanstack/react-query';
import { deleteMyChildProfile } from '@entities/family';
import { useSession } from '@entities/session';
import { ApiError, hasApiErrorCode } from '@shared/api';

/**
 * Ребёнок удаляет свой профиль (DELETE /families/:id/children/me). Семья —
 * из сессии ребёнка. Что делать после удаления (выйти), решает страница.
 */
export function useDeleteMyProfile() {
  const familyId = useSession()?.user.family?.id ?? null;
  return useMutation({
    mutationFn: () => {
      if (!familyId) throw new Error('No family');
      return deleteMyChildProfile(familyId);
    },
  });
}

/** Сервер не удалил: на счету ещё есть деньги. */
export const isChildHasBalanceError = (error: unknown) =>
  error instanceof ApiError &&
  error.status === 409 &&
  hasApiErrorCode(error, 'CHILD_HAS_BALANCE');

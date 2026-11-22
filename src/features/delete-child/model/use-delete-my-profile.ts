import { useMutation } from '@tanstack/react-query';
import { deleteMyChildProfile } from '@entities/family';
import { useSession } from '@entities/session';
import { apiErrorCode, isApiError } from '@shared/api';

/**
 * Ребёнок удаляет свой профиль (DELETE /families/:id/children/me). Семья —
 * из сессии ребёнка. Что делать после удаления (выйти), решает страница.
 */
export function useDeleteMyProfile() {
  const familyId = useSession()?.user.family?.id ?? null;
  return useMutation({
    mutationFn: (expectedBalancePoints?: string) => {
      if (!familyId) throw new Error('No family');
      return deleteMyChildProfile(familyId, expectedBalancePoints);
    },
  });
}

export function childBalanceToConfirm(error: unknown) {
  if (!isApiError(error) || error.status !== 409) return undefined;
  const code = apiErrorCode(error);
  if (code !== 'CHILD_HAS_BALANCE' && code !== 'CHILD_BALANCE_CHANGED')
    return undefined;
  const data = error.data as { canWriteOff?: unknown; balancePoints?: unknown };
  if (
    data.canWriteOff === true &&
    typeof data.balancePoints === 'string' &&
    /^(0|[1-9][0-9]{0,18})$/.test(data.balancePoints)
  ) {
    return data.balancePoints;
  }
  return undefined;
}

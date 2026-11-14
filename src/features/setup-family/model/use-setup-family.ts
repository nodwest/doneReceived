import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createFamily,
  familiesKeys,
  joinFamilyByCode,
  type FamilyMembership,
} from '@entities/family';
import { syncData } from '@shared/api';

/**
 * Создать семью: вошедший становится owner. Семья сразу кладётся в кэш
 * GET /families — приложение видит её и уходит с Family setup на главную.
 */
export function useCreateFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createFamily(name.trim()),
    onSuccess: async (family) => {
      queryClient.setQueryData<FamilyMembership[]>(familiesKeys.mine(), [
        { ...family, role: 'owner' },
      ]);
      await syncData(queryClient, 'family-changed');
    },
    // 409 — семья уже есть (например, создали с другого устройства):
    // перечитываем список, и приложение пускает дальше.
    onError: () =>
      queryClient.invalidateQueries({ queryKey: familiesKeys.all }),
  });
}

/**
 * Вступить в семью по коду второго родителя (роль admin). Ответ — только
 * id семьи, поэтому список семей перечитываем.
 */
export function useJoinFamilyByCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinFamilyByCode,
    onSuccess: () => syncData(queryClient, 'family-changed'),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { joinFamilyByCode } from '@entities/family';
import { syncData } from '@shared/api';

/**
 * Вступление в семью по коду второго родителя (POST /families/join, роль
 * admin). После вступления перечитываем всё о семьях. 409
 * `ALREADY_IN_FAMILY` — родитель уже в непустой семье.
 */
export function useJoinFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinFamilyByCode,
    onSuccess: () => syncData(queryClient, 'family-changed'),
  });
}

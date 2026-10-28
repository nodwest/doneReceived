import { useMutation, useQueryClient } from '@tanstack/react-query';
import { familyKeys, joinFamily } from '@entities/family';

/** Вступление в семью по коду приглашения. */
export function useJoinFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinFamily,
    // Состав семьи и её коды поменялись — перечитываем данные семьи.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: familyKeys.all }),
  });
}

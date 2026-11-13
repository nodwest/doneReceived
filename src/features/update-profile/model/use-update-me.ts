import { useMutation, useQueryClient } from '@tanstack/react-query';
import { familiesKeys } from '@entities/family';
import { meKeys, updateMe } from '@entities/session';

/**
 * Сохранить своё имя (PATCH /users/me): свежий профиль сразу в кэш `useMe`
 * — имя меняется на главной, в Profile и Edit profile; семьи перечитываем,
 * там имя видят остальные (участники, карточки на Family).
 */
export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (user) => {
      queryClient.setQueryData(meKeys.all, user);
      queryClient.invalidateQueries({ queryKey: familiesKeys.all });
    },
  });
}

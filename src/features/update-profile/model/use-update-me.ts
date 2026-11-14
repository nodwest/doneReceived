import { useMutation, useQueryClient } from '@tanstack/react-query';
import { meKeys, updateMe } from '@entities/session';
import { syncData } from '@shared/api';

/**
 * Сохранить своё имя (PATCH /users/me): свежий профиль сразу в кэш `useMe`
 * — имя меняется на главной, в Profile и Edit profile; остальное, где видно
 * имя (семья, задания, лента, история), перечитывается.
 */
export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (user) => {
      queryClient.setQueryData(meKeys.all, user);
      syncData(queryClient, 'profile-changed');
    },
  });
}

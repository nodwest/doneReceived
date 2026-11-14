import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMyAvatar, meKeys, uploadMyAvatar } from '@entities/session';
import type { PickedPhoto } from '@shared/lib';
import { syncData } from '@shared/api';

/**
 * Сменить своё фото (`photo`) или убрать его (`null`): профиль сразу в кэш,
 * остальное, где видно фото (семья, задания, лента, история), перечитывается.
 */
export function useMyAvatarChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photo: PickedPhoto | null) => {
      if (photo) return uploadMyAvatar(photo);
      await deleteMyAvatar();
      return null;
    },
    onSuccess: (user) => {
      if (user) queryClient.setQueryData(meKeys.all, user);
      syncData(queryClient, 'profile-changed');
    },
  });
}

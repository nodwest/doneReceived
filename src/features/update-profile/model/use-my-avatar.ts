import { useMutation, useQueryClient } from '@tanstack/react-query';
import { familiesKeys } from '@entities/family';
import { deleteMyAvatar, meKeys, uploadMyAvatar } from '@entities/session';
import type { PickedPhoto } from '@shared/lib';

/**
 * Сменить своё фото (`photo`) или убрать его (`null`): профиль перечитываем —
 * аватар меняется на главной, в Profile и Edit profile; семьи тоже — там
 * фото видят остальные.
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
      queryClient.invalidateQueries({ queryKey: meKeys.all });
      queryClient.invalidateQueries({ queryKey: familiesKeys.all });
    },
  });
}

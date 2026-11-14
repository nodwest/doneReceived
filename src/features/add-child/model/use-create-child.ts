import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createChild,
  setChildAvatar,
  useCurrentFamily,
} from '@entities/family';
import type { PickedPhoto } from '@shared/lib';
import { syncData } from '@shared/api';

type NewChild = { name: string; photo: PickedPhoto | null };

/**
 * Создать профиль ребёнка в семье вошедшего родителя (POST
 * /families/:id/children), а с фото — сразу поставить ему аватар. Профиль
 * создан, а фото не загрузилось — не ошибка: `avatarError` для тоста.
 */
export function useCreateChild() {
  const queryClient = useQueryClient();
  const familyId = useCurrentFamily()?.id ?? null;
  return useMutation({
    mutationFn: async ({ name, photo }: NewChild) => {
      if (!familyId) throw new Error('No family');
      const child = await createChild(familyId, name);
      let avatarError: unknown = null;
      if (photo) {
        await setChildAvatar(familyId, child.id, photo).catch((error) => {
          avatarError = error;
        });
      }
      return { child, avatarError };
    },
    onSuccess: () => syncData(queryClient, 'child-changed'),
  });
}

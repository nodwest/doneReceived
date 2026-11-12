import { useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { useTaskFamilyId } from '@features/family-tasks';
import { useFamilyChildren } from '@entities/family';
import type { WishlistOwner } from '@entities/wish';
import { childProfilesMock } from '@shared/mocks';

type WishlistChild = {
  id: string;
  name: string;
  /** null — фото нет, буква имени. */
  avatar: ImageSourcePropType | null;
};

/**
 * Чей вишлист смотрит родитель: моковые Emma и Liam или ребёнок семьи с
 * сервера. `loading` — дети с сервера ещё грузятся, уводить рано.
 */
export function useWishlistChild(id: string) {
  const familyId = useTaskFamilyId();
  const { data: serverChildren, isPending } = useFamilyChildren(familyId);
  const child = useMemo<WishlistChild | undefined>(() => {
    const mock = childProfilesMock.find((item) => String(item.id) === id);
    if (mock) return { id, name: mock.name, avatar: mock.avatar };
    const server = serverChildren?.find((item) => item.id === id);
    return (
      server && {
        id,
        name: server.displayName,
        avatar: server.avatarUrl ? { uri: server.avatarUrl } : null,
      }
    );
  }, [id, serverChildren]);
  const owner = useMemo<WishlistOwner | null>(
    () => (child ? { childId: id, familyId } : null),
    [child, id, familyId],
  );
  return { child, owner, familyId, loading: !!familyId && isPending };
}

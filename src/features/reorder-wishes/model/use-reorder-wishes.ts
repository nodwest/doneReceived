import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reorderWishes, wishKeys, type Wish } from '@entities/wish';

/** Переставить желание: from и to — места в списке сверху вниз. */
type Move = { from: number; to: number };

/**
 * Новый порядок вишлиста. Список в кэше меняется сразу (оптимистично):
 * перетащенная строка встаёт на место без ожидания сервера, а остаток
 * баланса тут же перераспределяется по новому порядку.
 */
export function useReorderWishes(childId: number) {
  const queryClient = useQueryClient();
  const listKey = wishKeys.list(childId);

  return useMutation({
    // onMutate уже переставил список в кэше: отправляем его порядок.
    mutationFn: (_move: Move) => {
      const wishes = queryClient.getQueryData<Wish[]>(listKey) ?? [];
      return reorderWishes(wishes.map((wish) => wish.id));
    },
    onMutate: async ({ from, to }: Move) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<Wish[]>(listKey);
      if (previous) {
        const next = [...previous];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        queryClient.setQueryData(listKey, next);
      }
      return { previous };
    },
    // Сервер не принял порядок — возвращаем прежний.
    onError: (_error, _move, context) => {
      if (context?.previous)
        queryClient.setQueryData(listKey, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: wishKeys.all }),
  });
}

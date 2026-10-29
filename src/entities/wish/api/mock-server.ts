import { childAccountMock, wishesMock } from '@shared/mocks';
import type { UpdateWishPayload, Wish, WishPayload } from '../model/wish';

/**
 * Имитация бэкенда вишлистов, пока его нет: желания всех детей живут в
 * памяти до перезапуска приложения, порядок в массиве — порядок приоритета
 * внутри вишлиста ребёнка. С настоящим API этот файл удаляется целиком.
 */
let wishes: Wish[] = wishesMock.map((wish) => ({ ...wish }));
let nextId = Math.max(...wishes.map((wish) => wish.id)) + 1;

const fields = ({ title, price, description, link, photos }: WishPayload) => ({
  title,
  price,
  description,
  link,
  photos,
});

export const mockServer = {
  // Копия, как после сериализации ответа: снаружи данные «сервера» не изменить.
  list: (childId: number): Wish[] =>
    wishes
      .filter((wish) => wish.childId === childId)
      .map((wish) => ({ ...wish })),

  create: (payload: WishPayload): Wish => {
    // Желания добавляет сам ребёнок: сервер берёт его из сессии.
    const wish: Wish = {
      id: nextId++,
      childId: childAccountMock.id,
      createdAt: new Date().toISOString(),
      ...fields(payload),
    };
    wishes = payload.top ? [wish, ...wishes] : [...wishes, wish];
    return { ...wish };
  },

  update: ({ id, ...payload }: UpdateWishPayload): Wish => {
    const current = wishes.find((wish) => wish.id === id);
    if (!current) throw new Error(`Wish ${id} not found`);
    const updated: Wish = { ...current, ...fields(payload) };
    const rest = wishes.filter((wish) => wish.id !== id);
    // Без «top» желание остаётся на своём месте.
    wishes = payload.top
      ? [updated, ...rest]
      : wishes.map((wish) => (wish.id === id ? updated : wish));
    return { ...updated };
  },

  remove: (id: number) => {
    wishes = wishes.filter((wish) => wish.id !== id);
  },

  /** Новый порядок вишлиста одного ребёнка; чужие желания не трогаем. */
  reorder: (ids: readonly number[]) => {
    const byId = new Map(wishes.map((wish) => [wish.id, wish]));
    const ordered = ids.flatMap((id) => byId.get(id) ?? []);
    wishes = [...wishes.filter((wish) => !ids.includes(wish.id)), ...ordered];
  },
};

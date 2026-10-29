import type { Wish } from './wish';

/**
 * ready — денег хватает, можно просить купить; current — наполняется сейчас;
 * waiting — ждёт своей очереди.
 */
export type WishStatus = 'ready' | 'current' | 'waiting';

export interface WishProgress {
  wish: Wish;
  status: WishStatus;
  /** Сколько из баланса уже отложено на это желание. */
  saved: number;
}

/**
 * Баланс наполняет желания сверху вниз: на какое хватает целиком — готово,
 * следующее наполняется остатком, остальные ждут. После перестановки
 * желаний всё пересчитывается заново.
 */
export function allocateBalance(
  wishes: readonly Wish[],
  balance: number,
): WishProgress[] {
  let left = balance;
  let currentFound = false;
  return wishes.map((wish) => {
    if (!currentFound && left >= wish.price) {
      left -= wish.price;
      return { wish, status: 'ready', saved: wish.price };
    }
    if (!currentFound) {
      currentFound = true;
      const saved = left;
      left = 0;
      return { wish, status: 'current', saved };
    }
    return { wish, status: 'waiting', saved: 0 };
  });
}

/** Для плитки вишлиста: сколько готово к покупке и что наполняется сейчас. */
export function summarizeWishlist(progress: readonly WishProgress[]) {
  return {
    readyCount: progress.filter((item) => item.status === 'ready').length,
    current: progress.find((item) => item.status === 'current') ?? null,
  };
}

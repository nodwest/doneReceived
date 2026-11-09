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
  /** Место в очереди, с 1. */
  position: number;
  /** Название желания выше: ждущее начнёт копиться после него. */
  after: string | null;
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
  return wishes.map((wish, index) => {
    const place = {
      position: index + 1,
      after: index > 0 ? wishes[index - 1].title : null,
    };
    if (!currentFound && left >= wish.price) {
      left -= wish.price;
      return { wish, status: 'ready', saved: wish.price, ...place };
    }
    if (!currentFound) {
      currentFound = true;
      const saved = left;
      left = 0;
      return { wish, status: 'current', saved, ...place };
    }
    return { wish, status: 'waiting', saved: 0, ...place };
  });
}

/** Для плитки вишлиста: сколько готово к покупке и что наполняется сейчас. */
export function summarizeWishlist(progress: readonly WishProgress[]) {
  return {
    readyCount: progress.filter((item) => item.status === 'ready').length,
    current: progress.find((item) => item.status === 'current') ?? null,
  };
}

/** Как одна награда сдвинула копилку: желание, которое копилось после неё. */
export interface RewardGoal {
  title: string;
  price: number;
  /** Сколько было отложено на это желание до награды. */
  before: number;
  /** И сколько стало после. */
  after: number;
}

/**
 * Какое желание наполнялось сразу после награды и на сколько она его
 * сдвинула. Баланс до и после награды раскладывается по вишлисту так же, как
 * сейчас; null — копить было не на что (вишлист пуст или всё готово).
 */
export function getRewardGoal(
  wishes: readonly Wish[],
  balanceBefore: number,
  balanceAfter: number,
): RewardGoal | null {
  const current = summarizeWishlist(
    allocateBalance(wishes, balanceAfter),
  ).current;
  if (!current) return null;
  const before =
    allocateBalance(wishes, Math.max(balanceBefore, 0)).find(
      (item) => item.wish.id === current.wish.id,
    )?.saved ?? 0;
  return {
    title: current.wish.title,
    price: current.wish.price,
    before,
    after: current.saved,
  };
}

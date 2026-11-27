import { getParentFunds, type ParentFunds } from '@entities/wallet';

/**
 * Деньги родителя для формы задания. Награда задания с сервера уже в
 * резерве: при правке на новую сумму доступно свободное плюс она
 * (`ownReserve`); у нового задания — 0.
 */
export const fundsForTask = (funds: ParentFunds, ownReserve = 0) =>
  getParentFunds(funds.total, Math.max(funds.reserved - ownReserve, 0));

export interface RewardBudget {
  /** Награда не влезает в свободные деньги. */
  over: boolean;
  /** Сколько свободно останется после этого задания; не влезает — 0. */
  left: number;
  /** Сколько не хватает; влезает — 0. */
  short: number;
  /**
   * Длина полосы: весь кошелёк, а если не влезает — резерв и награда целиком,
   * чтобы нехватка торчала за край кошелька.
   */
  scale: number;
}

/** Во что обойдётся задание с наградой `amount` (`funds` — из `fundsForTask`). */
export function getRewardBudget(
  { total, reserved, available }: ParentFunds,
  amount: number,
): RewardBudget {
  const over = amount > available;
  return {
    over,
    left: Math.max(available - amount, 0),
    short: Math.max(amount - available, 0),
    scale: over ? reserved + amount : total,
  };
}

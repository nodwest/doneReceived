/**
 * Деньги родителя для заданий: всё в кошельке, сколько обещано за ещё не
 * выплаченные задания (резерв) и сколько свободно на новые награды.
 * Суммы — целые доллары (1 балл API = $1).
 */
export interface ParentFunds {
  total: number;
  reserved: number;
  available: number;
}

export const getParentFunds = (
  total: number,
  reserved: number,
): ParentFunds => ({
  total,
  reserved,
  available: Math.max(total - reserved, 0),
});

/** Целые доллары с разделителем тысяч: 1000 → «$1,000». */
export const formatMoney = (amount: number) =>
  `$${String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

import { startOfDay } from '@shared/lib';
import type { Operation } from './operation';

/** Итоги одного дня для графика и сводки. */
export interface DayTotals {
  /** Полночь дня по местному времени. */
  date: Date;
  earned: number;
  missed: number;
}

/** Суммы earned и missed по всем операциям. */
export function sumTotals(operations: Operation[]) {
  const totals = { earned: 0, missed: 0 };
  for (const operation of operations) {
    totals[operation.kind] += operation.amount;
  }
  return totals;
}

/** Последние начисленные награды; история уже отсортирована: сначала новые. */
export const latestRewards = (operations: Operation[], count: number) =>
  operations.filter((operation) => operation.kind === 'earned').slice(0, count);

/** Суммы earned и missed по каждому дню; дни без операций — нули. */
export function getDayTotals(
  days: Date[],
  operations: Operation[],
): DayTotals[] {
  const byDay = new Map<number, Operation[]>();
  for (const operation of operations) {
    const key = startOfDay(new Date(operation.at)).getTime();
    const day = byDay.get(key);
    if (day) day.push(operation);
    else byDay.set(key, [operation]);
  }
  return days.map((date) => ({
    date,
    ...sumTotals(byDay.get(date.getTime()) ?? []),
  }));
}

export const isSameDay = (operation: Operation, day: Date) =>
  startOfDay(new Date(operation.at)).getTime() === day.getTime();

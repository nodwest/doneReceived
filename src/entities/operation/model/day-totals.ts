import { addDays, startOfDay } from '@shared/lib';
import type { Operation } from './operation';

/** Итоги одного дня для графика и сводки. */
export interface DayTotals {
  /** Полночь дня по местному времени. */
  date: Date;
  earned: number;
  missed: number;
}

/**
 * Дни истории: от самой ранней операции до сегодняшнего дня включительно.
 * Будущих дней нет — сегодня всегда последний.
 */
export function getHistoryDays(operations: Operation[], today: Date): Date[] {
  const last = startOfDay(today);
  const first = operations.reduce((min, operation) => {
    const day = startOfDay(new Date(operation.at));
    return day < min ? day : min;
  }, last);

  const days: Date[] = [];
  for (let day = first; day <= last; day = addDays(day, 1)) days.push(day);
  return days;
}

/** Суммы earned и missed по всем операциям. */
export function sumTotals(operations: Operation[]) {
  const totals = { earned: 0, missed: 0 };
  for (const operation of operations) {
    totals[operation.kind] += operation.amount;
  }
  return totals;
}

/** Операции начиная с полуночи дня `from` (включительно). */
export const operationsSince = (operations: Operation[], from: Date) =>
  operations.filter((operation) => new Date(operation.at) >= from);

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

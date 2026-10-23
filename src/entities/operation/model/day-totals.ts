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

/** Суммы earned и missed по каждому дню; дни без операций — нули. */
export function getDayTotals(
  days: Date[],
  operations: Operation[],
): DayTotals[] {
  const totals = new Map(
    days.map((date) => [date.getTime(), { date, earned: 0, missed: 0 }]),
  );
  for (const operation of operations) {
    const day = totals.get(startOfDay(new Date(operation.at)).getTime());
    if (day) day[operation.kind] += operation.amount;
  }
  return [...totals.values()];
}

export const isSameDay = (operation: Operation, day: Date) =>
  startOfDay(new Date(operation.at)).getTime() === day.getTime();

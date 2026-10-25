import { addDays } from '@shared/lib';
import type { Operation } from './operation';

/** Период итогов в профиле: последние N дней вместе с сегодняшним или всё время. */
export type SummaryPeriod = 'today' | 'week' | 'month' | 'year' | 'all';

/** Варианты в порядке выбора; подписи — period.<key>. */
export const SUMMARY_PERIODS: readonly SummaryPeriod[] = [
  'today',
  'week',
  'month',
  'year',
  'all',
];

const PERIOD_DAYS: Record<Exclude<SummaryPeriod, 'all'>, number> = {
  today: 1,
  week: 7,
  month: 30,
  year: 365,
};

/** Операции за период: с полуночи первого дня периода по сегодня. */
export function operationsInPeriod(
  operations: Operation[],
  period: SummaryPeriod,
  today: Date,
) {
  if (period === 'all') return operations;
  const from = addDays(today, 1 - PERIOD_DAYS[period]);
  return operations.filter((operation) => new Date(operation.at) >= from);
}

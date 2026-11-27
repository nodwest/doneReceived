import type { Operation, OperationKind } from '@entities/operation';

// Полночь местного дня: тот же расчёт, что startOfDay из shared/lib, но без
// зависимости от общего барабана модулей — индекс остаётся чистым.
const startOfLocalDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** Задания одного дня одного вида: как их листают карточками и списком. */
export type OperationDayGroup = {
  date: Date;
  items: Operation[];
  total: number;
};

/**
 * Операции месяца, разложенные по дням и видам за один проход. Раньше экран
 * истории наград заново перебирал весь месяц на каждый выбор дня, на карточки,
 * на список и на итоги — при длинном месяце это десятки тысяч проверок на
 * каждый рендер.
 */
export type OperationIndex = {
  /** Все операции дня в порядке исходного списка (новые сверху). */
  day: (date: Date) => Operation[];
  /** Операции дня одного вида в том же порядке. */
  dayKind: (date: Date, kind: OperationKind) => Operation[];
  /** Итоги дня: начислено и упущено. */
  totals: (date: Date) => { earned: number; missed: number };
  /** Задания вида по дням: дни и задания новее сверху, с суммой за день. */
  groups: (kind: OperationKind) => OperationDayGroup[];
};

const NO_OPERATIONS: Operation[] = [];
const NO_GROUPS: OperationDayGroup[] = [];
const NO_TOTALS = { earned: 0, missed: 0 };

export function indexOperations(operations: Operation[]): OperationIndex {
  const byDay = new Map<number, Operation[]>();
  const byDayKind = new Map<string, Operation[]>();
  const totals = new Map<number, { earned: number; missed: number }>();
  const groups = new Map<OperationKind, OperationDayGroup[]>();

  for (const operation of operations) {
    const time = startOfLocalDay(new Date(operation.at));
    if (!Number.isFinite(time)) continue;

    const day = byDay.get(time);
    if (day) day.push(operation);
    else byDay.set(time, [operation]);

    const kindKey = `${time}:${operation.kind}`;
    const ofKind = byDayKind.get(kindKey);
    if (ofKind) ofKind.push(operation);
    else byDayKind.set(kindKey, [operation]);

    const sum = totals.get(time);
    if (sum) sum[operation.kind] += operation.amount;
    else
      totals.set(time, {
        earned: operation.kind === 'earned' ? operation.amount : 0,
        missed: operation.kind === 'missed' ? operation.amount : 0,
      });

    // Список идёт от новых к старым: дни идут подряд, поэтому группа дня —
    // последняя в массиве своего вида.
    const kindGroups = groups.get(operation.kind);
    const last = kindGroups?.[kindGroups.length - 1];
    if (kindGroups && last && last.date.getTime() === time) {
      last.items.push(operation);
      last.total += operation.amount;
    } else {
      const group = {
        date: new Date(time),
        items: [operation],
        total: operation.amount,
      };
      if (kindGroups) kindGroups.push(group);
      else groups.set(operation.kind, [group]);
    }
  }

  return {
    day: (date) => byDay.get(date.getTime()) ?? NO_OPERATIONS,
    dayKind: (date, kind) =>
      byDayKind.get(`${date.getTime()}:${kind}`) ?? NO_OPERATIONS,
    totals: (date) => totals.get(date.getTime()) ?? NO_TOTALS,
    groups: (kind) => groups.get(kind) ?? NO_GROUPS,
  };
}

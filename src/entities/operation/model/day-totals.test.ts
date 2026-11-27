import { describe, expect, it, vi } from 'vitest';
import {
  getDayTotals,
  getHistoryDays,
  isSameDay,
  latestRewards,
  sumTotals,
} from './day-totals';
import type { Operation } from './operation';

vi.mock('@shared/lib', () => import('../../../shared/lib/date'));

const at = (month: number, day: number, hour = 12) =>
  new Date(2026, month, day, hour).toISOString();

const operation = (
  id: string,
  kind: Operation['kind'],
  amount: number,
  time: string,
): Operation => ({
  id,
  title: id,
  kind,
  amount,
  child: { id: 'emma', name: 'Emma', avatar: null },
  parentId: 'sarah',
  at: time,
  description: '',
  doneAt: null,
  photos: [],
  note: null,
});

const today = new Date(2026, 10, 27, 15);

describe('getHistoryDays', () => {
  it('runs from the earliest operation to today, today last', () => {
    const days = getHistoryDays(
      [operation('a', 'earned', 4, at(10, 25, 9))],
      today,
    );
    expect(days).toEqual([
      new Date(2026, 10, 25),
      new Date(2026, 10, 26),
      new Date(2026, 10, 27),
    ]);
  });

  it('is only today without operations', () => {
    expect(getHistoryDays([], today)).toEqual([new Date(2026, 10, 27)]);
  });

  it('keeps at most a year', () => {
    const days = getHistoryDays(
      [operation('old', 'earned', 1, '2020-01-01T12:00:00Z')],
      today,
    );
    expect(days).toHaveLength(365);
    expect(days.at(-1)).toEqual(new Date(2026, 10, 27));
  });

  it('ignores an operation with a broken date', () => {
    expect(
      getHistoryDays([operation('bad', 'earned', 1, 'not a date')], today),
    ).toHaveLength(1);
  });
});

describe('totals', () => {
  const operations = [
    operation('a', 'earned', 4, at(10, 26, 9)),
    operation('b', 'missed', 3, at(10, 26, 20)),
    operation('c', 'earned', 5, at(10, 27, 8)),
  ];

  it('sums earned and missed', () => {
    expect(sumTotals(operations)).toEqual({ earned: 9, missed: 3 });
  });

  it('gives every day its totals, zero for empty days', () => {
    const days = [
      new Date(2026, 10, 25),
      new Date(2026, 10, 26),
      new Date(2026, 10, 27),
    ];
    expect(getDayTotals(days, operations)).toEqual([
      { date: days[0], earned: 0, missed: 0 },
      { date: days[1], earned: 4, missed: 3 },
      { date: days[2], earned: 5, missed: 0 },
    ]);
  });

  it('matches an operation to its local day', () => {
    expect(isSameDay(operations[1], new Date(2026, 10, 26))).toBe(true);
    expect(isSameDay(operations[1], new Date(2026, 10, 27))).toBe(false);
  });

  it('takes the latest rewards only', () => {
    const newestFirst = [...operations].reverse();
    expect(latestRewards(newestFirst, 1).map((item) => item.id)).toEqual(['c']);
  });
});

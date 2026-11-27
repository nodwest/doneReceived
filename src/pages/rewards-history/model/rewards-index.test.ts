import { describe, expect, it } from 'vitest';
import type { Operation } from '@entities/operation';
import { indexOperations } from './rewards-index';

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const at = (day: number, hour: number, minute = 0) =>
  new Date(2026, 10, day, hour, minute).toISOString();

const operation = (
  id: string,
  kind: 'earned' | 'missed',
  amount: number,
  time: string,
): Operation =>
  ({
    id,
    kind,
    amount,
    at: time,
    title: `Задача ${id}`,
    child: { id: 'child', name: 'Михалыч', avatar: null },
    parentId: 'parent',
    description: '',
    doneAt: null,
    photos: [],
    note: null,
  }) as Operation;

/** Прежнее поведение экрана: отдельные проходы на итоги, день и список. */
const legacyListDays = (operations: Operation[], kind: 'earned' | 'missed') => {
  const groups: { date: Date; items: Operation[]; total: number }[] = [];
  for (const item of operations) {
    if (item.kind !== kind) continue;
    const date = startOfDay(new Date(item.at));
    const last = groups[groups.length - 1];
    if (last && last.date.getTime() === date.getTime()) {
      last.items.push(item);
      last.total += item.amount;
    } else {
      groups.push({ date, items: [item], total: item.amount });
    }
  }
  return groups;
};

/** Новые сверху, как после sortByNewest на экране. */
const newestFirst = (operations: Operation[]) =>
  [...operations].sort(
    (a, b) => Date.parse(b.at) - Date.parse(a.at) || b.id.localeCompare(a.id),
  );

const sample = newestFirst([
  operation('e1', 'earned', 4, at(26, 18, 30)),
  operation('m1', 'missed', 2, at(26, 17)),
  operation('e2', 'earned', 5, at(25, 12)),
  operation('e3', 'earned', 3, at(25, 9)),
  operation('m2', 'missed', 7, at(24, 20)),
  operation('e4', 'earned', 10, at(1, 8)),
]);

const days = Array.from(
  { length: 30 },
  (_, index) => new Date(2026, 10, index + 1),
);

describe('indexOperations', () => {
  it('итоги дня совпадают с прежним расчётом', () => {
    const index = indexOperations(sample);
    for (const day of days) {
      const ofDay = sample.filter(
        (item) => startOfDay(new Date(item.at)).getTime() === day.getTime(),
      );
      const sum = (of: 'earned' | 'missed') =>
        ofDay
          .filter((item) => item.kind === of)
          .reduce((total, item) => total + item.amount, 0);
      expect(index.totals(day)).toEqual({
        earned: sum('earned'),
        missed: sum('missed'),
      });
    }
  });

  it('день и день вида отдают операции в исходном порядке', () => {
    const index = indexOperations(sample);
    expect(index.day(new Date(2026, 10, 26)).map((item) => item.id)).toEqual([
      'e1',
      'm1',
    ]);
    expect(
      index.dayKind(new Date(2026, 10, 26), 'earned').map((item) => item.id),
    ).toEqual(['e1']);
    expect(index.dayKind(new Date(2026, 10, 26), 'missed')).toHaveLength(1);
  });

  it('день без операций — пусто, без новых массивов на каждый вызов', () => {
    const index = indexOperations(sample);
    const empty = index.day(new Date(2026, 10, 10));
    expect(empty).toHaveLength(0);
    expect(index.day(new Date(2026, 10, 10))).toBe(empty);
    expect(index.groups('earned')).toBe(index.groups('earned'));
  });

  it('группы списка совпадают с прежним проходом по дням', () => {
    const index = indexOperations(sample);
    for (const kind of ['earned', 'missed'] as const) {
      const legacy = legacyListDays(sample, kind);
      const groups = index.groups(kind);
      expect(groups.map((group) => group.date.getTime())).toEqual(
        legacy.map((group) => group.date.getTime()),
      );
      expect(groups.map((group) => group.items.map((item) => item.id))).toEqual(
        legacy.map((group) => group.items.map((item) => item.id)),
      );
      expect(groups.map((group) => group.total)).toEqual(
        legacy.map((group) => group.total),
      );
    }
  });

  it('полночь делит дни, а неполные данные не ломают индекс', () => {
    const index = indexOperations([
      operation('late', 'earned', 1, at(26, 23, 59)),
      operation('early', 'earned', 1, at(27, 0, 1)),
      { ...operation('bad', 'earned', 1, ''), at: 'не дата' } as Operation,
    ]);
    expect(index.day(new Date(2026, 10, 26)).map((item) => item.id)).toEqual([
      'late',
    ]);
    expect(index.day(new Date(2026, 10, 27)).map((item) => item.id)).toEqual([
      'early',
    ]);
    expect(index.groups('earned')).toHaveLength(2);
  });

  it('пустой месяц — пустые ответы', () => {
    const index = indexOperations([]);
    expect(index.day(new Date(2026, 10, 1))).toHaveLength(0);
    expect(index.groups('earned')).toHaveLength(0);
    expect(index.totals(new Date(2026, 10, 1))).toEqual({
      earned: 0,
      missed: 0,
    });
  });

  it('на длинном месяце совпадает с прежним поведением', () => {
    const many: Operation[] = [];
    for (let day = 1; day <= 30; day++) {
      for (let n = 0; n < 12; n++) {
        many.push(
          operation(
            `${day}-${n}`,
            n % 3 === 0 ? 'missed' : 'earned',
            (n % 5) + 1,
            at(day, 8 + n),
          ),
        );
      }
    }
    const ordered = newestFirst(many);
    const index = indexOperations(ordered);
    const legacy = legacyListDays(ordered, 'earned');
    expect(index.groups('earned').map((group) => group.total)).toEqual(
      legacy.map((group) => group.total),
    );
    for (const day of days) {
      const totals = index.totals(day);
      const legacyTotals = ordered.filter(
        (item) => startOfDay(new Date(item.at)).getTime() === day.getTime(),
      );
      expect(totals.earned).toBe(
        legacyTotals
          .filter((item) => item.kind === 'earned')
          .reduce((sum, item) => sum + item.amount, 0),
      );
      expect(totals.missed).toBe(
        legacyTotals
          .filter((item) => item.kind === 'missed')
          .reduce((sum, item) => sum + item.amount, 0),
      );
    }
  });
});

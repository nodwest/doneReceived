import { describe, expect, it, vi } from 'vitest';
import {
  balanceAfter,
  formatTransactionAmount,
  formatTransactionTotal,
  groupByDay,
  transactionCode,
  type ChildTransaction,
  type Transaction,
} from './wallet';

// Барабан `@shared/lib` тянет нативные модули фото; нужны только даты.
vi.mock('@shared/lib', () => import('../../../shared/lib/date'));

/** ISO-время по местным часам: дни считаются по местному времени. */
const at = (day: number, hour: number) =>
  new Date(2026, 10, day, hour).toISOString();

const child = { id: 'emma', name: 'Emma', avatar: null };

const deposit = (id: string, amount: number, time: string): Transaction => ({
  id,
  kind: 'deposit',
  amount,
  at: time,
  card: null,
});

const payout = (id: string, amount: number, time: string): Transaction => ({
  id,
  kind: 'payout',
  amount,
  at: time,
  child,
  task: 'Clean room',
  operationId: `op-${id}`,
  taskDoneAt: null,
});

const reward = (
  id: string,
  amount: number,
  time: string,
): ChildTransaction => ({
  id,
  kind: 'reward',
  amount,
  at: time,
  from: { id: 'sarah', name: 'Sarah', avatar: null },
  task: 'Clean room',
  operationId: null,
  taskDoneAt: null,
});

describe('balanceAfter', () => {
  // Сейчас $146: пополнили $100, выплатили $4, пополнили $50.
  const history = [
    deposit('d1', 100, at(20, 9)),
    payout('p1', 4, at(20, 12)),
    deposit('d2', 50, at(21, 9)),
  ];

  it('rewinds later transactions from the current balance', () => {
    expect(balanceAfter(history, 146, history[0])).toBe(100);
    expect(balanceAfter(history, 146, history[1])).toBe(96);
    expect(balanceAfter(history, 146, history[2])).toBe(146);
  });

  it('does not depend on the order of the list', () => {
    expect(balanceAfter([...history].reverse(), 146, history[1])).toBe(96);
  });

  it('trusts the balance from the server when it is there', () => {
    const fromServer = { ...history[0], balanceAfter: 77 };
    expect(
      balanceAfter([fromServer, ...history.slice(1)], 146, fromServer),
    ).toBe(77);
  });
});

describe('groupByDay', () => {
  it('groups by local day, newest first, with income and outcome', () => {
    const days = groupByDay([
      deposit('d1', 100, at(20, 9)),
      payout('p1', 4, at(20, 18)),
      payout('p2', 6, at(20, 12)),
      deposit('d2', 50, at(21, 23)),
    ]);
    expect(days.map((day) => day.date)).toEqual([
      new Date(2026, 10, 21),
      new Date(2026, 10, 20),
    ]);
    expect(days[1].items.map((item) => item.id)).toEqual(['p1', 'p2', 'd1']);
    expect(days[1]).toMatchObject({ income: 100, outcome: 10 });
    expect(days[0]).toMatchObject({ income: 50, outcome: 0 });
  });

  it('counts child rewards as income', () => {
    expect(groupByDay([reward('r1', 4, at(20, 10))])[0]).toMatchObject({
      income: 4,
      outcome: 0,
    });
  });

  it('returns no days for no transactions', () => {
    expect(groupByDay([])).toEqual([]);
  });
});

describe('amount labels', () => {
  it('signs income and spending', () => {
    expect(formatTransactionAmount(deposit('d', 50, at(20, 9)))).toBe('+$50');
    expect(formatTransactionAmount(payout('p', 4, at(20, 9)))).toBe('−$4');
    expect(formatTransactionTotal(reward('r', 4, at(20, 9)))).toBe('+$4.00');
  });
});

describe('transactionCode', () => {
  it('is short and stable for a UUID', () => {
    const id = '3f2a9c1e-7b4d-4e8a-9c0f-1a2b3c4d5e6f';
    expect(transactionCode(id)).toBe('TX-3C4D-5E6F');
    expect(transactionCode(id)).toBe(transactionCode(id));
  });

  it('pads short ids', () => {
    expect(transactionCode('42')).toBe('TX-0000-0042');
  });
});

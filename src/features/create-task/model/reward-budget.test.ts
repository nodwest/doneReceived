import { describe, expect, it, vi } from 'vitest';
import { fundsForTask, getRewardBudget } from './reward-budget';

// Барабан `@entities/wallet` тянет экраны; нужна только чистая модель денег.
vi.mock(
  '@entities/wallet',
  () => import('../../../entities/wallet/model/funds'),
);

const funds = { total: 100, reserved: 30, available: 70 };

describe('getRewardBudget', () => {
  it('shows what is left when the reward fits', () => {
    expect(getRewardBudget(funds, 20)).toEqual({
      over: false,
      left: 50,
      short: 0,
      scale: 100,
    });
  });

  it('allows a reward equal to all free money', () => {
    expect(getRewardBudget(funds, 70)).toMatchObject({ over: false, left: 0 });
  });

  it('shows the shortage when the reward does not fit', () => {
    // Полоса длиннее кошелька: резерв $30 + награда $90 = $120, не хватает $20.
    expect(getRewardBudget(funds, 90)).toEqual({
      over: true,
      left: 0,
      short: 20,
      scale: 120,
    });
  });

  it('treats an empty reward as nothing spent', () => {
    expect(getRewardBudget(funds, 0)).toMatchObject({ over: false, left: 70 });
  });
});

describe('fundsForTask', () => {
  it('keeps funds as they are for a new task', () => {
    expect(fundsForTask(funds)).toEqual(funds);
  });

  it('frees the reserve of the task being edited', () => {
    // Задание на $10 уже в резерве: при правке доступно $70 + $10.
    expect(fundsForTask(funds, 10)).toEqual({
      total: 100,
      reserved: 20,
      available: 80,
    });
  });

  it('does not go below zero reserve when funds are stale', () => {
    expect(fundsForTask(funds, 50)).toEqual({
      total: 100,
      reserved: 0,
      available: 100,
    });
  });

  it('lets the edited task keep its reward even with no free money', () => {
    const full = { total: 50, reserved: 50, available: 0 };
    expect(getRewardBudget(fundsForTask(full, 10), 10).over).toBe(false);
    expect(getRewardBudget(fundsForTask(full, 10), 11)).toMatchObject({
      over: true,
      short: 1,
    });
  });
});

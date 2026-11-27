import { describe, expect, it } from 'vitest';
import { formatMoney, getParentFunds } from './funds';

describe('getParentFunds', () => {
  it('leaves for new tasks what is not reserved', () => {
    expect(getParentFunds(100, 30)).toEqual({
      total: 100,
      reserved: 30,
      available: 70,
    });
  });

  it('never shows negative available money', () => {
    expect(getParentFunds(10, 25).available).toBe(0);
  });
});

describe('formatMoney', () => {
  it.each([
    [0, '$0'],
    [5, '$5'],
    [999, '$999'],
    [1000, '$1,000'],
    [1234567, '$1,234,567'],
    [4.6, '$5'],
  ])('%s → %s', (amount, text) => {
    expect(formatMoney(amount)).toBe(text);
  });
});

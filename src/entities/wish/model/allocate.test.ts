import { describe, expect, it } from 'vitest';
import { allocateBalance, getRewardGoal, summarizeWishlist } from './allocate';
import type { Wish } from './wish';

const wish = (id: string, price: number): Wish => ({
  id,
  childId: 'child',
  title: id,
  price,
  description: '',
  link: '',
  photos: [],
  createdAt: '2026-11-01T00:00:00.000Z',
});

const ball = wish('Ball', 5);
const lego = wish('Lego', 10);
const bike = wish('Bike', 20);
const wishes = [ball, lego, bike];

const statuses = (balance: number) =>
  allocateBalance(wishes, balance).map(({ status, saved }) => [status, saved]);

describe('allocateBalance', () => {
  it('fills wishes from the top: ready, then current, then waiting', () => {
    expect(statuses(12)).toEqual([
      ['ready', 5],
      ['current', 7],
      ['waiting', 0],
    ]);
  });

  it('marks a wish ready when the balance covers it exactly', () => {
    expect(statuses(15)).toEqual([
      ['ready', 5],
      ['ready', 10],
      ['current', 0],
    ]);
  });

  it('keeps everything ready when there is money left over', () => {
    expect(statuses(100)).toEqual([
      ['ready', 5],
      ['ready', 10],
      ['ready', 20],
    ]);
  });

  it('starts the first wish with nothing saved on a zero balance', () => {
    expect(statuses(0)).toEqual([
      ['current', 0],
      ['waiting', 0],
      ['waiting', 0],
    ]);
  });

  it('does not let a cheaper wish below skip the queue', () => {
    // $8: на Lego ($10) не хватает — Ball ниже ждёт, хотя на него хватило бы.
    const progress = allocateBalance([lego, ball], 8);
    expect(progress.map((item) => item.status)).toEqual(['current', 'waiting']);
    expect(progress[0].saved).toBe(8);
  });

  it('numbers the queue and names the wish above', () => {
    expect(
      allocateBalance(wishes, 0).map(({ position, after }) => [
        position,
        after,
      ]),
    ).toEqual([
      [1, null],
      [2, 'Ball'],
      [3, 'Lego'],
    ]);
  });

  it('returns nothing for an empty wishlist', () => {
    expect(allocateBalance([], 50)).toEqual([]);
  });
});

describe('summarizeWishlist', () => {
  it('counts ready wishes and finds the one being filled', () => {
    const summary = summarizeWishlist(allocateBalance(wishes, 16));
    expect(summary.readyCount).toBe(2);
    expect(summary.current?.wish.id).toBe('Bike');
    expect(summary.current?.saved).toBe(1);
  });

  it('has no current wish when everything is ready', () => {
    expect(summarizeWishlist(allocateBalance(wishes, 35)).current).toBeNull();
  });
});

describe('getRewardGoal', () => {
  it('shows how a reward moved the wish being filled', () => {
    // Было $7: Ball готов, на Lego $2. Награда $4 → на Lego $6.
    expect(getRewardGoal(wishes, 7, 11)).toEqual({
      title: 'Lego',
      price: 10,
      before: 2,
      after: 6,
    });
  });

  it('moves on to the next wish when the reward completed one', () => {
    // Было $13 (Lego $8 из $10), награда $4 → Lego готов, на Bike $2.
    expect(getRewardGoal(wishes, 13, 17)).toEqual({
      title: 'Bike',
      price: 20,
      before: 0,
      after: 2,
    });
  });

  it('treats a negative balance before as zero', () => {
    expect(getRewardGoal(wishes, -3, 2)).toMatchObject({
      title: 'Ball',
      before: 0,
      after: 2,
    });
  });

  it('is null when there is nothing left to save for', () => {
    expect(getRewardGoal(wishes, 30, 40)).toBeNull();
    expect(getRewardGoal([], 0, 4)).toBeNull();
  });
});

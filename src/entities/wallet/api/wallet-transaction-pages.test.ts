import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchChildTransactionPage } from './child-wallet-api';
import { fetchParentTransactionPage } from './parent-wallet-api';
import { mergeWalletPages, nextWalletCursor } from './wallet-history-pages';

const { apiRequest } = vi.hoisted(() => ({ apiRequest: vi.fn() }));
vi.mock('@shared/api', () => ({ apiRequest, authorizedImage: vi.fn() }));
vi.mock('@shared/lib', () => ({
  withTimeout: (request: Promise<unknown>) => request,
}));

describe('wallet transaction pages', () => {
  beforeEach(() => vi.resetAllMocks());

  it('requests only the six recent parent operations with a cancellable request', async () => {
    const signal = new AbortController().signal;
    apiRequest.mockResolvedValue({ items: [], next: 'new-cursor' });

    await expect(
      fetchParentTransactionPage('family', 6, undefined, signal),
    ).resolves.toMatchObject({ transactions: [], next: 'new-cursor' });

    expect(apiRequest).toHaveBeenCalledExactlyOnceWith(
      '/families/family/wallet/transactions?limit=6',
      { signal },
    );
  });

  it('passes the child cursor unchanged and keeps server order for equal timestamps', async () => {
    const signal = new AbortController().signal;
    const createdAt = '2026-11-23T09:00:00.000Z';
    apiRequest.mockResolvedValue({
      balancePoints: '10',
      entries: [
        { id: 'later', points: 7, createdAt },
        { id: 'earlier', points: 3, createdAt },
      ],
      next: null,
    });

    const page = await fetchChildTransactionPage(
      'family',
      'child',
      20,
      'opaque+/=',
      signal,
    );

    expect(page.transactions.map(({ id }) => id)).toEqual(['later', 'earlier']);
    expect(page).toMatchObject({ balance: 10, next: null });
    expect(apiRequest).toHaveBeenCalledExactlyOnceWith(
      '/families/family/children/child/wallet?limit=20&before=opaque%2B%2F%3D',
      { signal },
    );
  });
});

describe('wallet history cursor chain', () => {
  it('keeps order and reaches the oldest operation after more than 2,000 entries', () => {
    const transactions = Array.from({ length: 2001 }, (_, index) => ({
      id: String(2001 - index),
    }));
    const pages: { transactions: { id: string }[] }[] = [];
    const seen: (string | undefined)[] = [];
    let cursor: string | undefined;
    do {
      seen.push(cursor);
      const from = cursor === undefined ? 0 : Number(cursor);
      const end = from + 20;
      pages.push({ transactions: transactions.slice(from, end) });
      cursor = nextWalletCursor(
        end < transactions.length ? String(end) : null,
        seen,
      );
    } while (cursor !== undefined);

    expect(pages).toHaveLength(101);
    expect(pages[0].transactions).toHaveLength(20);
    expect(mergeWalletPages(pages)).toEqual(transactions);
  });

  it('stops repeated cursors and keeps the first copy of a repeated operation', () => {
    expect(
      nextWalletCursor('seen', [undefined, 'seen', 'latest']),
    ).toBeUndefined();
    const original = { id: 'a', amount: 1 };
    const older = { id: 'b', amount: 3 };
    expect(
      mergeWalletPages([
        { transactions: [original] },
        { transactions: [{ id: 'a', amount: 2 }, older] },
      ]),
    ).toEqual([original, older]);
  });
});

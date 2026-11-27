import { afterEach, expect, it, vi } from 'vitest';
import { fetchRewardPeriod } from './server-operations-api';

const { apiRequest } = vi.hoisted(() => ({ apiRequest: vi.fn() }));
vi.mock('@shared/api', () => ({ apiRequest }));
vi.mock('@shared/lib', () => ({ withTimeout: vi.fn() }));

afterEach(() => {
  vi.unstubAllGlobals();
  apiRequest.mockReset();
});

const period = {
  from: '2026-11-01T00:00:00.000Z',
  to: '2026-12-01T00:00:00.000Z',
  timeZone: 'Europe/Moscow',
};
const viewer = {
  familyId: 'family',
  userId: 'child-user',
  child: { id: 'child', name: 'Child', avatarUrl: null },
};

it('only totals rewards approved by the viewing parent', async () => {
  apiRequest
    .mockResolvedValueOnce([{ id: 'child', displayName: 'Child' }])
    .mockResolvedValueOnce([
      { day: '2026-11-01', points: '5', approvedBy: 'parent' },
      { day: '2026-11-01', points: '9', approvedBy: 'other-parent' },
    ])
    .mockResolvedValueOnce({ entries: [] })
    .mockResolvedValueOnce({ items: [] });

  const result = await fetchRewardPeriod(
    { familyId: 'family', userId: 'parent' },
    period,
    'child',
    new AbortController().signal,
  );

  expect(result.earnedByDay.get('2026-11-01')).toBe(5);
});

it('stops following cursors after cancellation and allows a fresh request', async () => {
  const controller = new AbortController();
  apiRequest
    .mockResolvedValueOnce([])
    .mockImplementationOnce(async () => {
      await Promise.resolve();
      controller.abort();
      return { entries: [], next: 'unused-cursor' };
    })
    .mockResolvedValueOnce({ items: [] });

  await expect(
    fetchRewardPeriod(viewer, period, 'all', controller.signal),
  ).rejects.toThrow('Reward history request cancelled');
  expect(apiRequest).toHaveBeenCalledTimes(3);

  apiRequest
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce({ entries: [] })
    .mockResolvedValueOnce({ items: [] });
  await expect(
    fetchRewardPeriod(viewer, period, 'all', new AbortController().signal),
  ).resolves.toEqual({ earnedByDay: new Map(), operations: [] });
});

it('preserves dates and pagination on Android with the React Native constructor and abort signal', async () => {
  const NativeParams = URLSearchParams;
  vi.stubGlobal(
    'URLSearchParams',
    class extends NativeParams {
      constructor(params: Record<string, string>) {
        if (params instanceof NativeParams)
          throw new Error('Unsupported input');
        super(params);
      }
    },
  );
  const signal = new AbortController().signal;
  Object.defineProperty(signal, 'throwIfAborted', { value: undefined });
  apiRequest.mockImplementation(async (path: string) => {
    const { pathname, searchParams } = new URL(path, 'https://example.test');
    expect(searchParams.get('from')).toBe(period.from);
    expect(searchParams.get('to')).toBe(period.to);
    expect(pathname).toMatch(/^\/families\/family\/children\/child\//);
    if (pathname.endsWith('/reward-days')) {
      expect(searchParams.get('timeZone')).toBe(period.timeZone);
      return [{ day: '2026-11-01', points: '5', approvedBy: 'parent' }];
    }
    if (pathname.endsWith('/wallet')) {
      return { entries: [], next: searchParams.has('before') ? null : 'a+b=' };
    }
    return { items: [] };
  });

  const result = await fetchRewardPeriod(viewer, period, 'all', signal);

  expect(result.earnedByDay.get('2026-11-01')).toBe(5);
  expect(apiRequest).toHaveBeenCalledTimes(4);
  expect(
    apiRequest.mock.calls.some(([path]) => path.endsWith('before=a%2Bb%3D')),
  ).toBe(true);
  expect(
    apiRequest.mock.calls.every(([, options]) => options.signal === signal),
  ).toBe(true);
});

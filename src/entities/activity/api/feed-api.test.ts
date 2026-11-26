import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchFeed,
  fetchFeedHistoryPage,
  mergeFeedPages,
  presentFeed,
} from './feed-api';

const { apiRequest } = vi.hoisted(() => ({ apiRequest: vi.fn() }));
vi.mock('@shared/api', () => ({
  apiRequest,
  authorizedImage: vi.fn(),
  isApiError: (error: unknown) => error instanceof Error,
}));

const rejection = {
  id: 'closed',
  type: 'task_rejected',
  createdAt: '2026-11-25T09:00:00.000Z',
  actorId: 'parent',
  childId: 'child',
  assignmentId: 'task',
  taskTitle: 'Clean room',
  points: 4,
};
const viewer = { familyId: 'family', userId: 'parent' };

describe('activity pagination', () => {
  beforeEach(() => vi.resetAllMocks());

  it('sends scoped page filters and uses the server rejection status without extra requests', async () => {
    const earlier = {
      ...rejection,
      id: 'retryable',
      createdAt: '2026-11-24T09:00:00.000Z',
      rejectionClosed: false,
    };
    apiRequest.mockResolvedValueOnce({
      items: [{ ...rejection, rejectionClosed: true }, earlier],
    });
    const signal = new AbortController().signal;
    const filters = {
      before: 'opaque+cursor=',
      since: '2026-11-01T00:00:00.000Z',
      childId: 'child',
    };
    const page = await fetchFeed('family', 20, signal, filters);
    const [url, options] = apiRequest.mock.calls[0];
    expect(
      Object.fromEntries(new URL(url, 'https://example.test').searchParams),
    ).toEqual({ limit: '20', ...filters });
    expect(options).toEqual({ signal });
    expect(apiRequest).toHaveBeenCalledTimes(1);
    expect(
      presentFeed(mergeFeedPages([page, page]), viewer).map(({ type }) => type),
    ).toEqual(['task_closed', 'task_rejected']);
  });

  it('preserves closing rejection labels when a legacy server omits them', async () => {
    apiRequest
      .mockResolvedValueOnce({ items: [rejection] })
      .mockResolvedValueOnce({
        items: [{ assignmentId: 'task', reason: 'rejected' }],
      });
    const page = await fetchFeed('family', 20, new AbortController().signal);
    expect(apiRequest).toHaveBeenCalledTimes(2);
    expect(presentFeed(page, viewer)[0].type).toBe('task_closed');
  });

  it('continues old-server cursors without filters and stops at the cutoff', async () => {
    apiRequest
      .mockRejectedValueOnce(
        Object.assign(new Error('Unsupported filter'), {
          status: 400,
          messages: ['property since should not exist'],
        }),
      )
      .mockResolvedValueOnce({
        items: [
          { ...rejection, rejectionClosed: true },
          {
            ...rejection,
            id: 'sibling',
            childId: 'sibling',
            rejectionClosed: false,
          },
        ],
        next: 'legacy-cursor',
      })
      .mockResolvedValueOnce({
        items: [
          {
            ...rejection,
            createdAt: '2026-10-01T00:00:00.000Z',
            rejectionClosed: true,
          },
        ],
        next: 'too-old',
      });
    const signal = new AbortController().signal;
    const filters = { since: '2026-11-01T00:00:00.000Z', childId: 'child' };
    const first = await fetchFeedHistoryPage('family', 20, signal, filters);
    expect(first.legacy).toBe(true);
    expect(first.activity.items.map(({ id }) => id)).toEqual(['closed']);
    const next = await fetchFeedHistoryPage('family', 20, signal, filters, {
      before: 'legacy-cursor',
      legacy: first.legacy,
    });
    expect(next.activity).toEqual({ items: [], next: null });
    expect(apiRequest.mock.calls.map(([url]) => url)).toEqual([
      '/families/family/activity?limit=20&since=2026-11-01T00%3A00%3A00.000Z&childId=child',
      '/families/family/activity?limit=20',
      '/families/family/activity?limit=20&before=legacy-cursor',
    ]);
  });

  it('does not fall back after an access error', async () => {
    const error = Object.assign(new Error('Forbidden'), {
      status: 403,
      messages: ['property since should not exist'],
    });
    apiRequest.mockRejectedValueOnce(error);
    await expect(
      fetchFeedHistoryPage('family', 20, new AbortController().signal, {
        since: '2026-11-01T00:00:00.000Z',
      }),
    ).rejects.toBe(error);
    expect(apiRequest).toHaveBeenCalledTimes(1);
  });
});

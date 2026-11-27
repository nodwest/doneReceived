import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchFeed, mergeFeedPages, presentFeed } from './feed-api';

const { apiRequest } = vi.hoisted(() => ({ apiRequest: vi.fn() }));
vi.mock('@shared/api', () => ({
  apiRequest,
  authorizedImage: vi.fn(),
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
    ).toEqual({ limit: '20', pageBy: 'card', ...filters });
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

  it('keeps task history from before the card date cutoff', async () => {
    const creation = {
      ...rejection,
      id: 'creation',
      type: 'task_created',
      createdAt: '2026-10-01T00:00:00.000Z',
    };
    apiRequest.mockResolvedValueOnce({
      items: [{ ...rejection, rejectionClosed: true }, creation],
      next: null,
    });
    const signal = new AbortController().signal;
    const filters = { since: '2026-11-01T00:00:00.000Z', childId: 'child' };
    const page = await fetchFeed('family', 20, signal, filters);
    expect(presentFeed(page, viewer).map(({ id }) => id)).toEqual([
      'closed',
      'creation',
    ]);
  });

  it('does not fall back after an access error', async () => {
    const error = Object.assign(new Error('Forbidden'), {
      status: 403,
    });
    apiRequest.mockRejectedValueOnce(error);
    await expect(
      fetchFeed('family', 20, new AbortController().signal, {
        since: '2026-11-01T00:00:00.000Z',
      }),
    ).rejects.toBe(error);
    expect(apiRequest).toHaveBeenCalledTimes(1);
  });
});

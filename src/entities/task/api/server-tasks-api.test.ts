import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  reviewServerSubmission,
  submitServerTask,
  withdrawServerSubmission,
} from './server-tasks-api';

const { apiRequest, appendPhoto } = vi.hoisted(() => ({
  apiRequest: vi.fn(),
  appendPhoto: vi.fn(),
}));

vi.mock('@shared/api', () => ({ apiRequest, authorizedImage: vi.fn() }));
vi.mock('@shared/lib', () => ({ appendPhoto }));

describe('task submission requests', () => {
  beforeEach(() => vi.resetAllMocks());

  it('sends the same key and payload again when the first response is lost', async () => {
    apiRequest.mockRejectedValueOnce(new Error('response lost'));
    apiRequest.mockResolvedValueOnce({ id: 'original-report' });

    const submit = () =>
      submitServerTask('family', 'assignment', 'Done', [], 'request-123');
    await expect(submit()).rejects.toThrow('response lost');
    await expect(submit()).resolves.toEqual({ id: 'original-report' });

    expect(apiRequest.mock.calls[0]).toEqual(apiRequest.mock.calls[1]);
    expect(apiRequest.mock.calls[1][1]).toMatchObject({
      method: 'POST',
      body: { note: 'Done', clientRequestId: 'request-123' },
    });
  });

  it('includes the key in multipart requests', async () => {
    const photo = {
      uri: 'blob:photo',
      name: 'photo.jpg',
      type: 'image/jpeg' as const,
      width: 1,
      height: 1,
    };
    await submitServerTask(
      'family',
      'assignment',
      'Done',
      [photo],
      'request-123',
    );

    const body = apiRequest.mock.calls[0][1].body as FormData;
    expect(body.get('clientRequestId')).toBe('request-123');
    expect(body.get('note')).toBe('Done');
    expect(appendPhoto).toHaveBeenCalledWith(body, 'photos', photo);
  });

  it('never looks up a replacement report when the opened report has no ID', async () => {
    const assignment = { id: 'assignment' };
    await expect(
      withdrawServerSubmission('family', assignment),
    ).rejects.toThrow();
    await expect(
      reviewServerSubmission('family', assignment, { decision: 'approved' }),
    ).rejects.toThrow();
    expect(apiRequest).not.toHaveBeenCalled();
  });

  it('retries DELETE against the same report and returns its note', async () => {
    apiRequest.mockRejectedValueOnce(new Error('response lost'));
    apiRequest.mockResolvedValueOnce({ note: 'Saved on the server' });
    const withdraw = () =>
      withdrawServerSubmission('family', {
        id: 'assignment',
        submissionId: 'original-report',
      });

    await expect(withdraw()).rejects.toThrow('response lost');
    await expect(withdraw()).resolves.toEqual({ note: 'Saved on the server' });
    expect(apiRequest.mock.calls).toEqual([
      [
        '/families/family/task-submissions/original-report',
        { method: 'DELETE', signal: undefined },
      ],
      [
        '/families/family/task-submissions/original-report',
        { method: 'DELETE', signal: undefined },
      ],
    ]);
  });
});

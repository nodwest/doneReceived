import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createServerTask,
  fetchServerTasks,
  updateServerTask,
} from './server-tasks-api';

const { apiRequest } = vi.hoisted(() => ({ apiRequest: vi.fn() }));

vi.mock('@shared/api', () => ({
  apiRequest,
  authorizedImage: (path: string) => ({ uri: `api${path}` }),
}));
vi.mock('@shared/lib', () => ({ appendPhoto: vi.fn() }));

const viewer = { familyId: 'family', userId: 'sarah', childName: 'Emma' };

const taskDto = (patch = {}) => ({
  id: 'task',
  createdBy: 'sarah',
  title: 'Clean room',
  description: null,
  deadlineAt: null,
  rewardPoints: 4,
  createdAt: '2026-11-26T09:00:00.000Z',
  cancelledAt: null,
  checklist: [],
  ...patch,
});

const assignmentDto = (patch = {}) => ({
  id: 'assignment',
  childId: 'emma',
  status: 'assigned',
  retryableRejection: false,
  checkedItemIds: [],
  pendingSubmission: null,
  lastRejection: null,
  words: null,
  ...patch,
});

const load = async (...items: { task?: object; assignment?: object }[]) => {
  apiRequest.mockResolvedValueOnce(
    items.map(({ task, assignment }) => ({
      task: taskDto(task),
      assignment: assignmentDto(assignment),
    })),
  );
  return fetchServerTasks(viewer);
};

describe('fetchServerTasks', () => {
  beforeEach(() => vi.resetAllMocks());

  it('asks only for open assignments of the family', async () => {
    await load();
    expect(apiRequest).toHaveBeenCalledWith(
      '/families/family/tasks?status=assigned,submitted,rejected',
      { signal: undefined },
    );
  });

  it('maps an assignment to a task', async () => {
    const [task] = await load({});
    expect(task).toMatchObject({
      id: 'assignment',
      serverTaskId: 'task',
      title: 'Clean room',
      description: '',
      reward: 4,
      status: 'active',
      assignee: { id: 'emma', name: 'Emma' },
      createdBy: 'sarah',
      canManage: true,
      expiresAt: null,
      doneAt: null,
      note: null,
      photos: [],
      rejection: null,
      words: null,
      checklist: [],
    });
  });

  it('lets only the author manage the task', async () => {
    const [task] = await load({ task: { createdBy: 'george' } });
    expect(task.canManage).toBe(false);
  });

  it('hides cancelled, approved, expired and closed assignments', async () => {
    const tasks = await load(
      { task: { cancelledAt: '2026-11-26T10:00:00.000Z' } },
      { assignment: { id: 'approved', status: 'approved' } },
      { assignment: { id: 'expired', status: 'expired' } },
      { assignment: { id: 'closed', status: 'rejected' } },
      {
        assignment: {
          id: 'redo',
          status: 'rejected',
          retryableRejection: true,
        },
      },
      { assignment: { id: 'review', status: 'submitted' } },
    );
    expect(tasks.map((task) => [task.id, task.status])).toEqual([
      ['redo', 'active'],
      ['review', 'review'],
    ]);
  });

  it('reads the report waiting for review', async () => {
    const [task] = await load({
      assignment: {
        status: 'submitted',
        pendingSubmission: {
          id: 'submission',
          submittedAt: '2026-11-26T17:00:00.000Z',
          note: '  All done!  ',
          attachments: [{ id: 'photo-1', contentType: 'image/jpeg' }],
        },
      },
    });
    expect(task).toMatchObject({
      status: 'review',
      submissionId: 'submission',
      doneAt: '2026-11-26T17:00:00.000Z',
      note: 'All done!',
      photos: [{ uri: 'api/families/family/task-attachments/photo-1' }],
    });
  });

  it('treats a blank note as no note', async () => {
    const [task] = await load({
      assignment: {
        status: 'submitted',
        pendingSubmission: {
          id: 's',
          submittedAt: '2026-11-26T17:00:00.000Z',
          note: '   ',
          attachments: [],
        },
      },
    });
    expect(task.note).toBeNull();
  });

  it('keeps the last rejection with the app reason', async () => {
    const [task] = await load({
      assignment: {
        status: 'rejected',
        retryableRejection: true,
        lastRejection: {
          reasonCode: 'not_finished',
          comment: null,
          reviewedBy: 'sarah',
          reviewedAt: '2026-11-26T18:00:00.000Z',
        },
      },
    });
    expect(task.status).toBe('active');
    expect(task.rejection).toEqual({
      reason: 'not-finished',
      comment: '',
      by: 'sarah',
      missedRanks: [],
    });
  });

  it('shows missed words of a failed words check without a reason chip', async () => {
    const [task] = await load({
      assignment: {
        status: 'rejected',
        retryableRejection: true,
        lastRejection: {
          reasonCode: 'words_missed',
          missedRanks: [12],
          comment: null,
          reviewedBy: 'sarah',
          reviewedAt: '2026-11-26T18:00:00.000Z',
        },
      },
    });
    expect(task.rejection).toMatchObject({
      reason: 'other',
      missedRanks: [12],
    });
  });

  it('marks checklist steps the child ticked', async () => {
    const [task] = await load({
      task: {
        checklist: [
          { id: 'bed', title: 'Make the bed' },
          { id: 'toys', title: 'Put toys away' },
        ],
      },
      assignment: { checkedItemIds: ['toys'] },
    });
    expect(task.checklist).toEqual([
      { id: 'bed', title: 'Make the bed', done: false },
      { id: 'toys', title: 'Put toys away', done: true },
    ]);
  });

  it('reads a words portion', async () => {
    const [task] = await load({
      assignment: {
        words: {
          portionId: 'portion',
          ranks: [11],
          reviewRanks: [],
          items: [
            {
              rank: 11,
              word: 'go',
              transcription: 'ɡoʊ',
              translation: 'идти',
              forms: null,
              collocations: [],
              example: 'Go!',
              exampleTranslation: 'Иди!',
            },
          ],
        },
      },
    });
    expect(task.words?.portionId).toBe('portion');
    expect(task.words?.items[0].forms).toBeUndefined();
  });
});

describe('task requests', () => {
  beforeEach(() => vi.resetAllMocks());

  const payload = {
    title: 'Clean room',
    reward: 4,
    description: '',
    expiresAt: null,
    assigneeId: 'emma',
    checklist: [{ id: 'bed', title: 'Make the bed' }, { title: 'Vacuum' }],
  };

  it('creates a task for one child without empty optional fields', async () => {
    await createServerTask('family', payload);
    expect(apiRequest).toHaveBeenCalledWith('/families/family/tasks', {
      method: 'POST',
      body: {
        title: 'Clean room',
        rewardPoints: 4,
        checklist: [{ id: 'bed', title: 'Make the bed' }, { title: 'Vacuum' }],
        childIds: ['emma'],
      },
    });
  });

  it('sends the deadline, description and request key when set', async () => {
    await createServerTask('family', {
      ...payload,
      description: 'Before dinner',
      expiresAt: '2026-11-27T18:00:00.000Z',
      clientRequestId: 'key',
    });
    expect(apiRequest.mock.calls[0][1].body).toMatchObject({
      description: 'Before dinner',
      deadlineAt: '2026-11-27T18:00:00.000Z',
      clientRequestId: 'key',
    });
  });

  it('clears the description and deadline when editing', async () => {
    await updateServerTask('family', {
      ...payload,
      id: 'assignment',
      serverTaskId: 'task',
      checklist: [],
    });
    expect(apiRequest).toHaveBeenCalledWith('/families/family/tasks/task', {
      method: 'PATCH',
      body: {
        title: 'Clean room',
        description: null,
        deadlineAt: null,
        rewardPoints: 4,
        checklist: [],
      },
    });
  });
});

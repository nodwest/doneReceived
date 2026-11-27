import { describe, expect, it, vi } from 'vitest';
import { groupFeed, groupFeedByDay, type FeedEvent } from './feed';
import { canHaveComments, matchStepComments } from './step-comment';

vi.mock('@shared/lib', () => import('../../../shared/lib/date'));

const at = (day: number, hour: number, minute = 0) =>
  new Date(2026, 10, day, hour, minute).toISOString();

const event = (
  id: string,
  type: FeedEvent['type'],
  time: string,
  assignmentId: string | null = null,
): FeedEvent => ({
  id,
  familyId: 'family',
  type,
  at: time,
  assignmentId,
  title: 'Clean room',
  points: 4,
  childId: 'emma',
  child: { name: 'Emma', avatar: null },
  actor: { name: 'Sarah', avatar: null },
  byMe: false,
});

// С сервера — новые первыми.
const events = [
  event('approved', 'task_approved', at(26, 19), 'room'),
  event('deposit', 'deposit', at(26, 18)),
  event('submitted', 'task_submitted', at(26, 17), 'room'),
  event('wish', 'wish_added', at(25, 12)),
  event('created', 'task_created', at(25, 9), 'room'),
];

describe('groupFeed', () => {
  it('collects all events of one task into one card', () => {
    const cards = groupFeed(events);
    expect(cards.map((card) => card.key)).toEqual([
      'task:room',
      'event:deposit',
      'event:wish',
    ]);
    expect(cards[0].events.map((item) => item.id)).toEqual([
      'approved',
      'submitted',
      'created',
    ]);
  });

  it('keeps different tasks apart', () => {
    const cards = groupFeed([
      event('a', 'task_created', at(26, 10), 'room'),
      event('b', 'task_created', at(26, 9), 'dishes'),
    ]);
    expect(cards).toHaveLength(2);
  });

  it('is empty for no events', () => {
    expect(groupFeed([])).toEqual([]);
  });
});

describe('groupFeedByDay', () => {
  it('puts a card on the day of its latest event', () => {
    const days = groupFeedByDay(groupFeed(events), new Date(2026, 10, 1));
    expect(days.map((day) => day.date)).toEqual([
      new Date(2026, 10, 26),
      new Date(2026, 10, 25),
    ]);
    // Задание начато 25-го, но последнее событие 26-го — карточка там.
    expect(days[0].cards.map((card) => card.key)).toEqual([
      'task:room',
      'event:deposit',
    ]);
    expect(days[1].cards.map((card) => card.key)).toEqual(['event:wish']);
  });

  it('drops cards not changed since the start of the period', () => {
    const days = groupFeedByDay(groupFeed(events), new Date(2026, 10, 26));
    expect(days).toHaveLength(1);
    expect(days[0].cards).toHaveLength(2);
  });
});

describe('matchStepComments', () => {
  const history = [
    event('rejected', 'task_rejected', at(26, 18, 0), 'room'),
    event('submitted-2', 'task_submitted', at(26, 17, 30), 'room'),
    event('submitted-1', 'task_submitted', at(26, 12, 0), 'room'),
    event('created', 'task_created', at(26, 9, 0), 'room'),
  ];

  it('attaches the note and the rejection to their steps by time', () => {
    const comments = matchStepComments(history, [
      {
        submittedAt: at(26, 17, 30),
        note: 'All done!',
        rejection: {
          at: at(26, 18, 0),
          comment: { reason: 'not-finished', text: 'Bed is not made' },
        },
      },
    ]);
    expect(Object.fromEntries(comments)).toEqual({
      'submitted-2': { reason: null, text: 'All done!' },
      rejected: { reason: 'not-finished', text: 'Bed is not made' },
    });
  });

  it('allows a gap of up to a minute and not more', () => {
    const near = matchStepComments(history, [
      { submittedAt: at(26, 12, 1), note: 'First try', rejection: null },
    ]);
    expect(near.get('submitted-1')?.text).toBe('First try');

    const far = matchStepComments(history, [
      { submittedAt: at(26, 12, 5), note: 'Lost', rejection: null },
    ]);
    expect(far.size).toBe(0);
  });

  it('gives each step at most one comment', () => {
    const comments = matchStepComments(history, [
      { submittedAt: at(26, 12, 0), note: 'One', rejection: null },
      { submittedAt: at(26, 12, 0), note: 'Two', rejection: null },
    ]);
    expect(comments.get('submitted-1')?.text).toBe('One');
    expect([...comments.values()].map((item) => item.text)).not.toContain(
      'Two',
    );
  });

  it('knows when a card can have comments', () => {
    expect(canHaveComments(history)).toBe(true);
    expect(canHaveComments([event('d', 'deposit', at(26, 9))])).toBe(false);
  });
});

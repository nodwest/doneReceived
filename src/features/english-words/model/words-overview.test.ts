import { describe, expect, it, vi } from 'vitest';
import type { Task } from '@entities/task';
import type { WordsState } from '@entities/word';
import {
  deckFocus,
  getWordsOverview,
  wordsRewardsOf,
  type WordsReward,
} from './words-overview';

// Барабаны сущностей тянут экраны; нужны только их чистые модели.
vi.mock('@entities/task', () => import('../../../entities/task/model/task'));
vi.mock(
  '@entities/word',
  () => import('../../../entities/word/model/words-task'),
);

const card = (rank: number) => ({
  rank,
  word: `word${rank}`,
  transcription: '',
  translation: '',
  collocations: [],
  example: '',
  exampleTranslation: '',
});

/** Порция: новые слова 11–13 и пройденное 2 для проверки. */
const portion = {
  portionId: 'portion-2',
  ranks: [13, 11, 12],
  reviewRanks: [2],
  items: [card(2), card(11), card(12), card(13)],
};

const state = (patch: Partial<WordsState> = {}): WordsState => ({
  enabled: true,
  rewardPoints: 5,
  payerId: 'sarah',
  wordsPerDay: 10,
  reviewCount: 5,
  learnedCount: 10,
  totalCount: 2666,
  status: 'learning',
  nextPortionAt: null,
  portion,
  ...patch,
});

const wordsTask = (patch: Partial<Task> = {}) =>
  ({
    id: 'assignment',
    status: 'active',
    rejection: null,
    words: portion,
    ...patch,
  }) as Task;

const plainTask = { id: 'chores', status: 'review', words: null } as Task;

describe('getWordsOverview', () => {
  it('maps the server status', () => {
    expect(getWordsOverview(state({ status: 'done_today' }), []).status).toBe(
      'tomorrow',
    );
    expect(getWordsOverview(state({ status: 'no_funds' }), []).status).toBe(
      'noFunds',
    );
    expect(
      getWordsOverview(state({ status: 'off', portion: null }), []).status,
    ).toBe('off');
  });

  it('shows new words of the portion in dictionary order, without review words', () => {
    const overview = getWordsOverview(state(), [wordsTask()]);
    expect(overview.words.map((word) => word.rank)).toEqual([11, 12, 13]);
    expect(overview.range).toEqual({ from: 11, to: 13 });
  });

  it('finds the portion task and ignores ordinary tasks', () => {
    expect(getWordsOverview(state(), [plainTask, wordsTask()]).task?.id).toBe(
      'assignment',
    );
  });

  it('trusts the task when the state is behind', () => {
    // Ребёнок сдал, список заданий уже перечитан, а `GET …/words` ещё нет.
    expect(
      getWordsOverview(state(), [wordsTask({ status: 'review' })]).status,
    ).toBe('review');
  });

  it('is redo when the portion came back after a check', () => {
    const rejected = wordsTask({
      rejection: {
        reason: 'other',
        comment: '',
        by: 'sarah',
        missedRanks: [2, 12],
      },
    });
    const overview = getWordsOverview(state({ status: 'review' }), [rejected]);
    expect(overview.status).toBe('redo');
    expect(overview.missed.map((word) => word.rank)).toEqual([2, 12]);
  });

  it('prefers missed words from the server state', () => {
    const overview = getWordsOverview(
      state({ status: 'redo', missedRanks: [13] }),
      [
        wordsTask({
          rejection: {
            reason: 'other',
            comment: '',
            by: 'sarah',
            missedRanks: [2],
          },
        }),
      ],
    );
    expect(overview.missed.map((word) => word.rank)).toEqual([13]);
  });

  it('takes the last paid portion from rewards', () => {
    const rewards: WordsReward[] = [
      { at: '2026-11-25T18:00:00Z', amount: 5, range: { from: 1, to: 10 } },
      { at: '2026-11-26T18:00:00Z', amount: 5, range: { from: 11, to: 20 } },
    ];
    expect(
      getWordsOverview(
        state({ status: 'done_today', portion: null }),
        [],
        rewards,
      ).lastRange,
    ).toEqual({ from: 11, to: 20 });
  });
});

describe('wordsRewardsOf', () => {
  it('keeps only rewards for words', () => {
    const from = { id: 'sarah', name: 'Sarah', avatar: null };
    const base = { task: '', operationId: null, taskDoneAt: null, from };
    expect(
      wordsRewardsOf({
        balance: 9,
        transactions: [
          {
            ...base,
            id: 'a',
            kind: 'reward',
            amount: 5,
            at: 'x',
            words: { from: 1, to: 10 },
          },
          { ...base, id: 'b', kind: 'reward', amount: 4, at: 'y' },
          { id: 'c', kind: 'withdrawal', amount: 3, at: 'z', card: '4242' },
        ],
      }),
    ).toEqual([{ at: 'x', amount: 5, range: { from: 1, to: 10 } }]);
    expect(wordsRewardsOf(undefined)).toEqual([]);
  });
});

describe('deckFocus', () => {
  it('opens the dictionary on today’s words while learning', () => {
    const overview = getWordsOverview(state(), [wordsTask()]);
    expect(deckFocus(overview)).toEqual({
      start: 11,
      today: { from: 11, to: 13 },
    });
  });

  it('opens on the last paid portion after the check', () => {
    const overview = getWordsOverview(
      state({ status: 'done_today', portion: null }),
      [],
      [{ at: 'x', amount: 5, range: { from: 1, to: 10 } }],
    );
    expect(deckFocus(overview)).toEqual({
      start: 1,
      today: { from: 1, to: 10 },
    });
  });

  it('opens after the last portion when words are off', () => {
    const overview = getWordsOverview(
      state({ status: 'off', portion: null }),
      [],
      [{ at: 'x', amount: 5, range: { from: 1, to: 10 } }],
    );
    expect(deckFocus(overview)).toEqual({ start: 11, today: null });
  });
});

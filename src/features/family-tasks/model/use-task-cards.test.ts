import { describe, expect, it } from 'vitest';
import type { Task } from '@entities/task';
import { cardIndex, initialCardIds } from './use-task-cards';

const task = (id: string) => ({ id }) as Task;

describe('initialCardIds', () => {
  it('без задания из ссылки обе вкладки пустые', () => {
    expect(initialCardIds(null, 'all')).toEqual({ all: null, review: null });
    expect(initialCardIds(null, 'review')).toEqual({ all: null, review: null });
  });

  it('задание из ссылки открывается на своей вкладке', () => {
    expect(initialCardIds('t1', 'all')).toEqual({ all: 't1', review: null });
    expect(initialCardIds('t1', 'review')).toEqual({ all: null, review: 't1' });
  });
});

describe('cardIndex', () => {
  const tasks = [task('a'), task('b'), task('c')];

  it('находит запомненную карточку', () => {
    expect(cardIndex(tasks, 'b')).toBe(1);
  });

  it('неизвестное и пустое задание — первая карточка', () => {
    expect(cardIndex(tasks, 'нет такой')).toBe(0);
    expect(cardIndex(tasks, null)).toBe(0);
  });

  it('пустая лента — нулевой индекс', () => {
    expect(cardIndex([], 'a')).toBe(0);
  });
});

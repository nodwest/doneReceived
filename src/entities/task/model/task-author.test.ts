import { describe, expect, it } from 'vitest';
import type { Task } from '@entities/task';
import { taskAuthor } from './task-author';

const task = (over: Partial<Task>) => ({ ...over }) as Task;

describe('taskAuthor', () => {
  it('берёт имя и фото автора из задания', () => {
    const author = taskAuthor(
      task({ authorName: 'Иван', authorAvatar: { uri: 'avatar' } as never }),
      'Родитель',
    );
    expect(author.name).toBe('Иван');
    expect(author.avatar).not.toBeNull();
  });

  it('без автора — переданная подпись и буква вместо фото', () => {
    const author = taskAuthor(task({}), 'Родитель');
    expect(author.name).toBe('Родитель');
    expect(author.avatar).toBeNull();
  });
});

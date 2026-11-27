import type { Task } from './task';

/**
 * Автор задания для шапки карточки или плитки: имя и фото из участников семьи,
 * без фото — буква имени; имя неизвестно — переданная подпись («Родитель»).
 * Готовится в одном месте для экранов родителя и ребёнка.
 */
export function taskAuthor(
  task: Pick<Task, 'authorName' | 'authorAvatar'>,
  parentLabel: string,
) {
  return {
    name: task.authorName ?? parentLabel,
    avatar: task.authorAvatar ?? null,
  };
}

import { useState } from 'react';
import type { Task } from '@entities/task';

/** Вкладки экрана заданий: общий словарь для страниц и хука. */
export type TaskCardsTab = 'all' | 'review';
export type TaskCardsView = 'cards' | 'list';

/** Карточка какого задания открыта на вкладке; null — ни одна. */
export type TaskCardIds = Record<TaskCardsTab, string | null>;

/**
 * С какой карточки начинают вкладки: задание из ссылки открывается на своей
 * вкладке, на другой вкладке карточки нет до первого тапа.
 */
export function initialCardIds(
  initialTaskId: string | null,
  initialTab: TaskCardsTab,
): TaskCardIds {
  return {
    all: initialTab === 'review' ? null : initialTaskId,
    review: initialTab === 'review' ? initialTaskId : null,
  };
}

/**
 * Номер карточки в ленте вкладки: неизвестное или пропавшее задание — первая
 * карточка, чтобы лента не вставала на пустое место.
 */
export function cardIndex(
  tasks: readonly Pick<Task, 'id'>[],
  currentId: string | null,
): number {
  return Math.max(
    tasks.findIndex((task) => task.id === currentId),
    0,
  );
}

/**
 * Состояние карточек на экранах заданий — общее для родителя и ребёнка:
 * список или лента, какая карточка открыта на каждой вкладке и как её
 * открыть. Раньше этот блок был продублирован в двух страницах.
 */
export function useTaskCards({
  cardTasks,
  tab,
  initialTaskId = null,
  initialTab = 'all',
}: {
  /** Задания текущей вкладки без слов дня: по ним листаются карточки. */
  cardTasks: readonly Pick<Task, 'id'>[];
  /** Открытая вкладка: у каждой своя запомненная карточка. */
  tab: TaskCardsTab;
  /** Задание из ссылки `?task=` — сразу открывается карточкой. */
  initialTaskId?: string | null;
  /** Вкладка из ссылки `?tab=` — на ней же и стояла бы карточка. */
  initialTab?: TaskCardsTab;
}) {
  const [view, setView] = useState<TaskCardsView>(
    initialTaskId ? 'cards' : 'list',
  );
  const [ids, setIds] = useState<TaskCardIds>(() =>
    initialCardIds(initialTaskId, initialTab),
  );
  const currentId = ids[tab];
  const setCurrentId = (id: string) =>
    setIds((prev) => ({ ...prev, [tab]: id }));
  const currentIndex = cardIndex(cardTasks, currentId);
  // Без заданий карточек нет, даже если до этого смотрели лентой.
  const cards = view === 'cards' && cardTasks.length > 0;
  const openCard = (task: Pick<Task, 'id'>) => {
    setCurrentId(task.id);
    setView('cards');
  };
  return {
    view,
    setView,
    cards,
    currentId,
    currentIndex,
    setCurrentId,
    openCard,
  };
}

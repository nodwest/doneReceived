import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { TaskCard, type Task } from '@entities/task';
import { theme } from '@shared/theme';
import { SnapCarousel } from '@shared/ui';

type TaskCarouselProps = {
  tasks: readonly Task[];
  /** С какой карточки начать (например, после выбора задачи в списке). */
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Своя карточка вместо TaskCard (карточки ребёнка). */
  renderTask?: (task: Task, style: ViewStyle) => ReactNode;
  /** Цвет активной точки: фиолетовый у родителя, голубой у ребёнка. */
  tone?: 'parent' | 'child';
};

/** Крупные карточки заданий, которые листаются свайпом; под лентой точки страниц. */
export function TaskCarousel({
  tasks,
  initialIndex,
  onIndexChange,
  renderTask = (task, style) => <TaskCard task={task} style={style} />,
  tone = 'parent',
}: TaskCarouselProps) {
  return (
    <SnapCarousel
      items={tasks}
      keyExtractor={(task) => task.id}
      renderItem={renderTask}
      initialIndex={initialIndex}
      onIndexChange={onIndexChange}
      dotColor={tone === 'child' ? theme.colors.childFrom : theme.colors.violet}
    />
  );
}

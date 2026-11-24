import { SnapCarousel } from '@shared/ui';
import type { TaskPagerProps } from './task-pager.types';

export function TaskPager(props: TaskPagerProps) {
  return (
    <SnapCarousel
      {...props}
      keyExtractor={(task) => task.id}
      fill
      gutter={16}
      peek={0}
    />
  );
}

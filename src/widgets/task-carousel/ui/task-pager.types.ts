import type { Task } from '@entities/task';
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export type TaskPagerProps = {
  items: readonly Task[];
  renderItem: (task: Task, style: ViewStyle) => ReactNode;
  initialIndex: number;
  onIndexChange?: (index: number) => void;
  dotColor: string;
};

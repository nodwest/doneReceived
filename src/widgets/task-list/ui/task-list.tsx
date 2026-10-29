import type { ReactNode } from 'react';
import { View } from 'react-native';
import { TaskRow, type Task } from '@entities/task';
import { styles } from './task-list.styled';

type TaskListProps = {
  tasks: readonly Task[];
  onSelect?: (task: Task) => void;
  /** Своя строка вместо TaskRow (строки ребёнка). */
  renderTask?: (task: Task) => ReactNode;
};

/** Задания списком: активные и ожидающие проверки. */
export function TaskList({ tasks, onSelect, renderTask }: TaskListProps) {
  return (
    <View style={styles.list}>
      {tasks.map((task) =>
        renderTask ? (
          <View key={task.id}>{renderTask(task)}</View>
        ) : (
          <TaskRow key={task.id} task={task} onPress={onSelect} />
        ),
      )}
    </View>
  );
}

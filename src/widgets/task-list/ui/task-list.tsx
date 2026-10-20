import { View } from 'react-native';
import { TaskRow, type Task } from '@entities/task';
import { styles } from './task-list.styled';

type TaskListProps = {
  tasks: readonly Task[];
  onSelect?: (task: Task) => void;
};

/** Задания списком: активные и ожидающие проверки. */
export function TaskList({ tasks, onSelect }: TaskListProps) {
  return (
    <View style={styles.list}>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} onPress={onSelect} />
      ))}
    </View>
  );
}

import type { ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { formatCountdown, useNow } from '@shared/lib';
import type { Task } from '../model';
import { TaskIconBadge } from './task-icon-badge';
import { styles } from './child-task-tile.styled';

type ChildTaskTileProps = {
  task: Task;
  /** Подпись над названием: «Next up» у ближайшего, «Coming up» у остальных. */
  label: string;
  /** Кнопка внизу плитки (I did it!). */
  action?: ReactNode;
  onPress?: (task: Task) => void;
  style?: StyleProp<ViewStyle>;
};

/** Плитка активного задания в карусели на главной ребёнка. */
export function ChildTaskTile({
  task,
  label,
  action,
  onPress,
  style,
}: ChildTaskTileProps) {
  const now = useNow();
  const expires = task.expiresAt ? new Date(task.expiresAt) : null;

  // Нажимается верх плитки, а не вся она: кнопка action — соседняя, не
  // вложенная (на вебе кнопка внутри кнопки — невалидный HTML).
  return (
    <View style={[styles.tile, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={task.title}
        onPress={() => onPress?.(task)}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <TaskIconBadge />
        <View style={styles.info}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {task.title}
          </Text>
        </View>
        <View style={styles.aside}>
          {expires && (
            <Text style={styles.timer}>
              {formatCountdown(expires.getTime() - now.getTime())}
            </Text>
          )}
          <View style={styles.reward}>
            <Text style={styles.rewardText}>${task.reward}</Text>
          </View>
        </View>
      </Pressable>
      {action}
    </View>
  );
}

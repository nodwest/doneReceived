import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCountdown, formatTimeAgo, useNow } from '@shared/lib';
import { theme } from '@shared/theme';
import { formatReward, type Task } from '../model';
import { styles } from './task-row.styled';

type TaskRowProps = {
  task: Task;
  onPress?: (task: Task) => void;
};

/** Строка задания в списке: исполнитель, описание, статус и награда. */
export function TaskRow({ task, onPress }: TaskRowProps) {
  const now = useNow();
  const review = task.status === 'review';

  let aside: string | null = null;
  if (review && task.doneAt) {
    aside = `Done ${formatTimeAgo(new Date(task.doneAt), now)}`;
  } else if (!review && task.expiresAt) {
    aside = formatCountdown(new Date(task.expiresAt).getTime() - now.getTime());
  }

  const content = (
    <>
      <View style={styles.assignee}>
        <Image source={task.assignee.avatar} style={styles.avatar} />
        <Text style={styles.name}>{task.assignee.name}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {task.title}
          </Text>
          {aside && (
            <Text style={[styles.aside, review && styles.asideReview]}>
              {aside}
            </Text>
          )}
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.chip, review && styles.chipReview]}>
            <Text style={[styles.chipText, review && styles.chipTextReview]}>
              {review ? 'Review' : 'Active'}
            </Text>
          </View>
          <Text style={styles.reward}>{formatReward(task.reward)}</Text>
        </View>
      </View>
    </>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${task.title}, ${task.assignee.name}`}
      onPress={() => onPress?.(task)}
      style={({ pressed }) => [
        styles.row,
        review ? styles.rowReview : styles.rowActive,
        pressed && styles.pressed,
      ]}
    >
      {/* Тёплый градиент «на проверке» под содержимым строки. */}
      {review && (
        <LinearGradient
          colors={[theme.colors.reviewFrom, theme.colors.reviewTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.7071]}
          style={StyleSheet.absoluteFill}
        />
      )}
      {content}
    </Pressable>
  );
}

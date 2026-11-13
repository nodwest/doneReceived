import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { formatTimeAgo, useNow } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon, ApiImage } from '@shared/ui';
import { formatRewardShort, type Task, type TaskAssignee } from '../model';
import { styles } from './child-review-row.styled';
import { AssigneeAvatar } from './assignee-avatar';

type ChildReviewRowProps = {
  task: Task;
  /** Родитель, который проверяет: «Sarah is checking». */
  author: Pick<TaskAssignee, 'name' | 'avatar'>;
  onPress?: (task: Task) => void;
};

/**
 * Задание ребёнка на проверке: фото-отчёт (или значок задания), когда
 * отправлено, кто из родителей проверяет и сколько придёт после проверки.
 */
export function ChildReviewRow({ task, author, onPress }: ChildReviewRowProps) {
  const { t } = useTranslation();
  const now = useNow();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={task.title}
      onPress={() => onPress?.(task)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[theme.colors.reviewRowFrom, theme.colors.reviewRowTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.head}>
        {task.photos.length > 0 ? (
          <ApiImage
            source={task.photos[0]}
            style={styles.thumb}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbIcon}>
            <Icon name="task" size={24} color={theme.colors.reviewIconSoft} />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {task.title}
          </Text>
          <View style={styles.meta}>
            {task.doneAt && (
              <Text style={styles.sent}>
                {t('tasks.sentAgo', {
                  ago: formatTimeAgo(new Date(task.doneAt), now),
                })}
              </Text>
            )}
            {task.photos.length > 0 && (
              <View style={styles.photoChip}>
                <Text style={styles.photoChipText}>
                  {t('tasks.photoCount', { count: task.photos.length })}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.status}>
        <AssigneeAvatar
          source={author.avatar}
          name={author.name}
          style={styles.checker}
        />
        <Text style={styles.checking} numberOfLines={1}>
          {t('tasks.checking', { name: author.name })}
        </Text>
        <Icon name="coin" size={18} color={theme.colors.yellow} />
        <Text style={styles.reward}>{formatRewardShort(task.reward)}</Text>
      </View>
    </Pressable>
  );
}

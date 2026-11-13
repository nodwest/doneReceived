import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { formatTimeAgo, useNow } from '@shared/lib';
import { theme } from '@shared/theme';
import type { Task, TaskAssignee } from '../model';
import { AssigneeAvatar } from './assignee-avatar';
import {
  RewardAmount,
  TILE_DESCRIPTION_LINES,
  TilePill,
  TileTimer,
  tileStyles,
} from './task-tile-parts';
import { styles } from './task-row.styled';

type TaskRowProps = {
  task: Task;
  /**
   * Кто в шапке: без него — ребёнок-исполнитель (вкладка Tasks), с ним — автор
   * задания, «from Sarah» (задания одного ребёнка из его профиля: чьи они, и
   * так видно).
   */
  author?: Pick<TaskAssignee, 'name' | 'avatar'>;
  onPress?: (task: Task) => void;
};

/**
 * Плитка задания в списке у родителя. Шапка: ребёнок (или автор), статус и
 * справа таймер — у сданного «Done 2 h ago». Под ней название целиком и
 * описание до 5 строк, внизу награда. Плитка растёт по содержимому.
 */
export function TaskRow({ task, author, onPress }: TaskRowProps) {
  const { t } = useTranslation();
  const now = useNow();
  const review = task.status === 'review';
  const person = author ?? task.assignee;

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
      {/* Тёплый градиент «на проверке» под содержимым плитки. */}
      {review && (
        <LinearGradient
          colors={[theme.colors.reviewFrom, theme.colors.reviewTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.7071]}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={tileStyles.head}>
        <AssigneeAvatar
          source={person.avatar}
          name={person.name}
          style={tileStyles.avatar}
        />
        <View style={[tileStyles.meta, styles.meta]}>
          <Text style={tileStyles.name} numberOfLines={1}>
            {author && (
              <Text style={tileStyles.namePrefix}>{t('taskCard.from')} </Text>
            )}
            {person.name}
          </Text>
          <View style={[styles.chip, review && styles.chipReview]}>
            <Text style={[styles.chipText, review && styles.chipTextReview]}>
              {review ? t('tasks.review') : t('tasks.active')}
            </Text>
          </View>
        </View>
        {review
          ? task.doneAt && (
              <TilePill
                tone="review"
                label={t('tasks.doneAgo', {
                  ago: formatTimeAgo(new Date(task.doneAt), now),
                })}
              />
            )
          : task.expiresAt && <TileTimer expiresAt={task.expiresAt} />}
      </View>
      <Text style={tileStyles.title}>{task.title}</Text>
      {!!task.description && (
        <Text
          style={tileStyles.description}
          numberOfLines={TILE_DESCRIPTION_LINES}
        >
          {task.description}
        </Text>
      )}
      <View style={styles.footer}>
        <RewardAmount reward={task.reward} />
      </View>
    </Pressable>
  );
}

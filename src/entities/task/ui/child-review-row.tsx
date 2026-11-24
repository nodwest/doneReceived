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
  tileStyles,
} from './task-tile-parts';
import { styles } from './child-review-row.styled';

type ChildReviewRowProps = {
  task: Task;
  /** Родитель, который проверяет: «Sarah is checking». */
  author: Pick<TaskAssignee, 'name' | 'avatar'>;
  onPress?: (task: Task) => void;
};

/**
 * Плитка задания ребёнка на проверке — как у родителя, но светлее и
 * глазами ребёнка. Шапка: родитель, который проверяет, чип On review и
 * когда отправлено. Название, описание до 5 строк; внизу награда, сколько
 * фото в отчёте и «Sarah is checking».
 */
export function ChildReviewRow({ task, author, onPress }: ChildReviewRowProps) {
  const { t } = useTranslation();
  const now = useNow();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={task.title}
      onPress={() => onPress?.(task)}
      style={({ pressed }) => [
        styles.tile,
        tileStyles.surface,
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={[
          theme.colors.reviewTileChildFrom,
          theme.colors.reviewTileChildTo,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[tileStyles.head, styles.head]}>
        <AssigneeAvatar
          source={author.avatar}
          name={author.name}
          style={tileStyles.avatar}
        />
        <View style={[tileStyles.meta, styles.meta]}>
          <Text style={tileStyles.name} numberOfLines={1}>
            {author.name}
          </Text>
          <View style={styles.chip}>
            <Text style={styles.chipText} numberOfLines={1}>
              {t('tasks.onReview')}
            </Text>
          </View>
        </View>
        {task.doneAt && (
          <TilePill
            tone="reviewChild"
            label={t('tasks.sentAgo', {
              ago: formatTimeAgo(new Date(task.doneAt), now),
            })}
          />
        )}
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
        <View style={styles.footerAside}>
          {task.photos.length > 0 && (
            <View style={styles.photoChip}>
              <Text style={styles.photoChipText}>
                {t('tasks.photoCount', { count: task.photos.length })}
              </Text>
            </View>
          )}
          <Text style={styles.checking} numberOfLines={1}>
            {t('tasks.checking', { name: author.name })}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

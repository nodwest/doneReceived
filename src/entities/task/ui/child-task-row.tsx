import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { formatCountdown, formatTimeAgo, useNow } from '@shared/lib';
import { theme } from '@shared/theme';
import { formatReward, type Task } from '../model';
import { TaskIconBadge } from './task-icon-badge';
import { styles } from './child-task-row.styled';

type ChildTaskRowProps = {
  task: Task;
  /** Кнопка под активным заданием (I did it!). */
  action?: ReactNode;
  onPress?: (task: Task) => void;
};

/**
 * Строка задания в списке ребёнка: описание, статус и награда. Под активным —
 * кнопка из action, под заданием на проверке — плашка «Waiting for approval…».
 */
export function ChildTaskRow({ task, action, onPress }: ChildTaskRowProps) {
  const { t } = useTranslation();
  const now = useNow();
  const review = task.status === 'review';

  let aside: string | null = null;
  if (review && task.doneAt) {
    aside = t('tasks.doneAgo', {
      ago: formatTimeAgo(new Date(task.doneAt), now),
    });
  } else if (!review && task.expiresAt) {
    aside = formatCountdown(new Date(task.expiresAt).getTime() - now.getTime());
  }

  // Нажимается строка без кнопки action: кнопка — соседняя, не вложенная
  // (на вебе кнопка внутри кнопки — невалидный HTML).
  return (
    <View style={[styles.row, review ? styles.rowReview : styles.rowActive]}>
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
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={task.title}
        onPress={() => onPress?.(task)}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <TaskIconBadge size={48} />
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
          {!!task.description && (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          )}
          <View style={styles.metaRow}>
            <View style={[styles.chip, review && styles.chipReview]}>
              <Text style={[styles.chipText, review && styles.chipTextReview]}>
                {review ? t('tasks.review') : t('tasks.active')}
              </Text>
            </View>
            <Text style={styles.reward}>{formatReward(task.reward)}</Text>
          </View>
        </View>
      </Pressable>
      {review ? (
        <View style={styles.waiting}>
          <Text style={styles.waitingText}>{t('tasks.waitingApproval')}</Text>
        </View>
      ) : (
        action
      )}
    </View>
  );
}

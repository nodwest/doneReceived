import type { ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTranslation } from '@shared/i18n';
import { formatCountdown, formatTimeAgo, useNow } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import type { Task, TaskAssignee } from '../model';
import { RewardChip } from './task-sheet';
import { styles } from './child-task-tile.styled';
import { AssigneeAvatar } from './assignee-avatar';

const DAY_MS = 24 * 60 * 60 * 1000;

type ChildTaskTileProps = {
  task: Task;
  /** Родитель, который дал задание: аватар и «from Sarah». */
  author: Pick<TaskAssignee, 'name' | 'avatar'>;
  /** Кнопка справа от награды (I did it!). */
  action?: ReactNode;
  onPress?: (task: Task) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Плитка активного задания у ребёнка — в карусели на главной и в списке
 * «To do»: от кого, сколько осталось, начало описания, награда и I did it!.
 * Таймер тёплый, пока осталось меньше суток, дальше — голубой.
 */
export function ChildTaskTile({
  task,
  author,
  action,
  onPress,
  style,
}: ChildTaskTileProps) {
  const { t } = useTranslation();
  const now = useNow();
  const left = task.expiresAt
    ? new Date(task.expiresAt).getTime() - now.getTime()
    : null;
  const warm = left !== null && left < DAY_MS;
  const timerColor = warm ? theme.colors.dueInk : theme.colors.childDeep;

  // Нажимается верх плитки, а не вся она: кнопка action — соседняя, не
  // вложенная (на вебе кнопка внутри кнопки — невалидный HTML).
  return (
    <View style={[styles.tile, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={task.title}
        onPress={() => onPress?.(task)}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <View style={styles.head}>
          <AssigneeAvatar
            source={author.avatar}
            name={author.name}
            style={styles.avatar}
          />
          <View style={styles.titleWrap}>
            <Text style={styles.title} numberOfLines={1}>
              {task.title}
            </Text>
            {task.rejection ? (
              // Задание вернули: ребёнок сразу видит, что его нужно переделать.
              <Text style={[styles.from, styles.sentBack]} numberOfLines={1}>
                {t('taskCard.sentBackShort')}
              </Text>
            ) : (
              <Text style={styles.from} numberOfLines={1}>
                {t('taskCard.from')}{' '}
                <Text style={styles.fromName}>{author.name}</Text>
                {' · '}
                {formatTimeAgo(new Date(task.createdAt), now)}
              </Text>
            )}
          </View>
          {left !== null && (
            <View
              style={[styles.timer, warm ? styles.timerWarm : styles.timerCool]}
            >
              <Icon name="clock" size={16} color={timerColor} />
              <Text style={[styles.timerText, { color: timerColor }]}>
                {formatCountdown(left)}
              </Text>
            </View>
          )}
        </View>
        {!!task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}
      </Pressable>
      <View style={styles.footer}>
        <RewardChip reward={task.reward} />
        {action}
      </View>
    </View>
  );
}

import type { ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTranslation } from '@shared/i18n';
import { formatTimeAgo, useNow } from '@shared/lib';
import type { Task, TaskAssignee } from '../model';
import { AssigneeAvatar } from './assignee-avatar';
import {
  RewardAmount,
  TILE_DESCRIPTION_LINES,
  TileTimer,
  tileStyles,
} from './task-tile-parts';
import { styles } from './child-task-tile.styled';

type ChildTaskTileProps = {
  task: Task;
  /** Родитель, который дал задание: аватар и имя. */
  author: Pick<TaskAssignee, 'name' | 'avatar'>;
  /** Кнопка справа от награды (I did it!). */
  action?: ReactNode;
  onPress?: (task: Task) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Плитка активного задания у ребёнка — в карусели на главной и в списке
 * «To do». Шапка: родитель, когда дал (или «Sent back to redo», если
 * вернули) и таймер. Под ней название целиком и описание до 5 строк. Внизу
 * награда — сведения, не кнопка — и I did it!. Плитка растёт по содержимому.
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
        <View style={tileStyles.head}>
          <AssigneeAvatar
            source={author.avatar}
            name={author.name}
            style={tileStyles.avatar}
          />
          <View style={tileStyles.meta}>
            <Text style={tileStyles.name} numberOfLines={1}>
              {author.name}
            </Text>
            {task.rejection ? (
              // Задание вернули: ребёнок сразу видит, что его нужно переделать.
              <Text style={styles.sentBackText} numberOfLines={1}>
                {t('taskCard.sentBackShort')}
              </Text>
            ) : (
              <Text style={tileStyles.caption} numberOfLines={1}>
                {formatTimeAgo(new Date(task.createdAt), now)}
              </Text>
            )}
          </View>
          {task.expiresAt && <TileTimer expiresAt={task.expiresAt} />}
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
      </Pressable>
      <View style={styles.footer}>
        <RewardAmount reward={task.reward} />
        {action}
      </View>
    </View>
  );
}

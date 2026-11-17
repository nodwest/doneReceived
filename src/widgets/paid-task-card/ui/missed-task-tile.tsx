import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Operation } from '@entities/operation';
import {
  AssigneeAvatar,
  RewardAmount,
  TILE_DESCRIPTION_LINES,
  TilePaper,
  TilePill,
  tileStyles,
  type TaskAssignee,
} from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { formatClock, formatMonthDay } from '@shared/lib';
import { theme, tracking } from '@shared/theme';

type MissedTaskTileProps = {
  /** Упущенная награда из истории. */
  operation: Operation;
  /** Чьими глазами: родитель видит, кто не успел, ребёнок — от кого задание. */
  viewer: 'parent' | 'child';
  /** Родитель, который дал задание. */
  author: Pick<TaskAssignee, 'name' | 'avatar'>;
  onPress?: (operation: Operation) => void;
};

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/**
 * Плитка упущенного задания в списке Missed — как плитка выплаченного, в
 * графитовых тонах: чип Expired (или Closed), когда истекло, награда без
 * плюса, внизу — какой был срок.
 */
export function MissedTaskTile({
  operation,
  viewer,
  author,
  onPress,
}: MissedTaskTileProps) {
  const { t } = useTranslation();
  const child = viewer === 'child';
  const person = child ? author : operation.child;
  const closed = operation.missedReason === 'rejected';
  const missedAt = new Date(operation.at);
  const dueAt = operation.dueAt ? new Date(operation.dueAt) : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={operation.title}
      onPress={() => onPress?.(operation)}
      style={({ pressed }) => [
        styles.tile,
        tileStyles.surface,
        pressed && styles.pressed,
      ]}
    >
      <TilePaper />
      <View style={tileStyles.head}>
        <AssigneeAvatar
          source={person.avatar}
          name={person.name}
          style={tileStyles.avatar}
        />
        <View style={[tileStyles.meta, styles.meta]}>
          <Text style={tileStyles.name} numberOfLines={1}>
            {child && (
              <Text style={tileStyles.namePrefix}>{t('taskCard.from')} </Text>
            )}
            {person.name}
          </Text>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {t(closed ? 'rewardsHistory.closed' : 'rewardsHistory.expired')}
            </Text>
          </View>
        </View>
        <TilePill
          tone="missed"
          label={t(
            closed ? 'rewardsHistory.closedAt' : 'rewardsHistory.expiredAt',
            { time: formatClock(missedAt) },
          )}
        />
      </View>
      <Text style={tileStyles.title}>{operation.title}</Text>
      {!!operation.description && (
        <Text
          style={tileStyles.description}
          numberOfLines={TILE_DESCRIPTION_LINES}
        >
          {operation.description}
        </Text>
      )}
      <View style={styles.footer}>
        <RewardAmount reward={operation.amount} missed />
        {dueAt && (
          <Text style={styles.due} numberOfLines={1}>
            {t('rewardsHistory.dueAt', {
              time: sameDay(dueAt, missedAt)
                ? formatClock(dueAt)
                : formatMonthDay(dueAt),
            })}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    gap: 10,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  pressed: {
    opacity: 0.85,
  },
  meta: {
    gap: 4,
  },
  chip: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.missedTile,
  },
  chipText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: theme.colors.missedDeep,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 4,
  },
  due: {
    flexShrink: 1,
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});

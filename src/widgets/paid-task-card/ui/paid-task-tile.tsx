import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Operation } from '@entities/operation';
import {
  AssigneeAvatar,
  RewardAmount,
  TILE_DESCRIPTION_LINES,
  TilePill,
  tileStyles,
  type TaskAssignee,
} from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { formatClock, formatMonthDay } from '@shared/lib';
import { theme, tracking } from '@shared/theme';

type PaidTaskTileProps = {
  /** Начисленная награда из истории. */
  operation: Operation;
  /** Чьими глазами: родитель видит, кто сделал, ребёнок — от кого задание. */
  viewer: 'parent' | 'child';
  /** Родитель, который дал и подтвердил задание. */
  approver: Pick<TaskAssignee, 'name' | 'avatar'>;
  onPress?: (operation: Operation) => void;
};

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/**
 * Плитка выплаченного задания в списке «Paid tasks» / «My rewards» — как
 * плитки заданий, в зелёных тонах. Шапка: у ребёнка — от кого задание, у
 * родителя — кто сделал; чип Approved и когда выплачено. Название целиком,
 * описание до 5 строк, внизу награда и когда задание сдали.
 */
export function PaidTaskTile({
  operation,
  viewer,
  approver,
  onPress,
}: PaidTaskTileProps) {
  const { t } = useTranslation();
  const child = viewer === 'child';
  const person = child ? approver : operation.child;
  const paidAt = new Date(operation.at);
  const doneAt = operation.doneAt ? new Date(operation.doneAt) : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={operation.title}
      onPress={() => onPress?.(operation)}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
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
            <Text style={styles.chipText}>{t('rewardsHistory.approved')}</Text>
          </View>
        </View>
        <TilePill
          tone="paid"
          label={t('rewardsHistory.paidAt', { time: formatClock(paidAt) })}
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
        <RewardAmount reward={operation.amount} paid />
        {doneAt && (
          <Text style={styles.done} numberOfLines={1}>
            {t('rewardsHistory.doneAt', {
              time: sameDay(doneAt, paidAt)
                ? formatClock(doneAt)
                : formatMonthDay(doneAt),
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
    backgroundColor: theme.colors.white,
    boxShadow: '0px 6px 16px rgba(26, 26, 51, 0.06)',
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
    backgroundColor: theme.colors.rewardSoft,
  },
  chipText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: theme.colors.rewardText,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 4,
  },
  done: {
    flexShrink: 1,
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});

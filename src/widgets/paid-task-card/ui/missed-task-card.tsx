import type { StyleProp, ViewStyle } from 'react-native';
import { Text, View } from 'react-native';
import { formatAmount, type Operation } from '@entities/operation';
import {
  HeroPill,
  InfoTiles,
  TaskBrief,
  TaskSheet,
  type InfoTileProps,
  type TaskAssignee,
} from '@entities/task';
import { useTranslation } from '@shared/i18n';
import {
  formatClock,
  formatDayInPhrase,
  formatMonthDay,
  useNow,
} from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './paid-task-card.styled';

type MissedTaskCardProps = {
  /** Упущенная награда из истории. */
  operation: Operation;
  /** Чьими глазами: родитель видит, кто не успел, ребёнок — от кого задание. */
  viewer: 'parent' | 'child';
  /** Родитель, который дал задание. */
  author: Pick<TaskAssignee, 'name' | 'avatar'>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Карточка упущенного задания — Rewards history, тогл Missed. Графитовая
 * шапка («Missed by Liam · Missed $3» у родителя, «Task from Sarah» у
 * ребёнка), что нужно было сделать, срок и когда истекло; внизу — куда ушли
 * деньги: родителю вернулись в кошелёк, у ребёнка упущены.
 */
export function MissedTaskCard({
  operation,
  viewer,
  author,
  style,
}: MissedTaskCardProps) {
  const { t } = useTranslation();
  const now = useNow();
  const parent = viewer === 'parent';
  const closed = operation.missedReason === 'rejected';
  const amount = formatAmount(operation.amount);
  const missedAt = new Date(operation.at);
  const dueAt = operation.dueAt ? new Date(operation.dueAt) : null;
  const date = t('time.dayAndTime', {
    day: formatMonthDay(missedAt),
    time: formatClock(missedAt),
  });

  const tiles: InfoTileProps[] = [
    {
      icon: 'clock',
      tone: 'grey',
      label: t(closed ? 'rewardCard.closedDay' : 'rewardCard.expiredDay', {
        day: formatDayInPhrase(missedAt, now),
      }),
      value: formatClock(missedAt),
    },
  ];
  if (dueAt) {
    tiles.unshift({
      icon: 'calendar',
      tone: 'warm',
      label: t('taskCard.dueDay', { day: formatDayInPhrase(dueAt, now) }),
      value: formatClock(dueAt),
    });
  }

  const title = parent
    ? closed
      ? 'rewardCard.closedParent'
      : 'rewardCard.expiredParent'
    : closed
      ? 'rewardCard.closedChild'
      : 'rewardCard.expiredChild';

  return (
    <TaskSheet
      tone="missed"
      avatar={(parent ? operation.child.avatar : author.avatar) ?? undefined}
      caption={parent ? t('rewardCard.missedBy') : t('taskCard.taskFrom')}
      name={parent ? operation.child.name : author.name}
      aside={
        <HeroPill
          icon="clock"
          label={t('rewardCard.missedAmount', { amount })}
        />
      }
      title={operation.title}
      style={style}
      footer={
        <View style={[styles.note, styles.noteMissed]}>
          <View style={[styles.noteIcon, styles.noteIconMissed]}>
            <Icon name="clock" size={16} color={theme.colors.white} />
          </View>
          <View style={styles.noteText}>
            <Text
              style={[styles.noteTitle, styles.noteTitleMissed]}
              numberOfLines={1}
            >
              {t(title, { amount })}
            </Text>
            <Text style={styles.noteCaption} numberOfLines={1}>
              {parent
                ? t('rewardCard.backToWallet', { date })
                : t('rewardCard.wentBackTo', { name: author.name, date })}
            </Text>
          </View>
        </View>
      }
    >
      <TaskBrief
        label={t('taskCard.whatToDo')}
        reward={operation.amount}
        missed
        description={operation.description}
      />
      <InfoTiles tiles={tiles} />
    </TaskSheet>
  );
}

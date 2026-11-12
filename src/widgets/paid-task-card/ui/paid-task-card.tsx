import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatAmount, type Operation } from '@entities/operation';
import {
  HeroPill,
  InfoTiles,
  PhotoSection,
  TaskBrief,
  TaskSheet,
  type InfoTileProps,
  type TaskAssignee,
} from '@entities/task';
import type { RewardGoal } from '@entities/wish';
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

type PaidTaskCardProps = {
  /** Начисленная награда из истории. */
  operation: Operation;
  /** Чьими глазами: родитель видит, кто сделал, ребёнок — от кого задание. */
  viewer: 'parent' | 'child';
  /** Родитель, который дал и подтвердил задание. */
  approver: Pick<TaskAssignee, 'name' | 'avatar'>;
  /** Только у ребёнка: как награда сдвинула копилку на желание. */
  goal?: RewardGoal | null;
  style?: StyleProp<ViewStyle>;
};

const percent = (part: number, whole: number): `${number}%` =>
  whole > 0 ? `${Math.min(Math.max((part / whole) * 100, 0), 100)}%` : '0%';

/**
 * Карточка выплаченного задания — открывается из Rewards history. Зелёная
 * шапка («Done by Emma · Paid $4» у родителя, «Task from Sarah · Earned $4» у
 * ребёнка), фото-отчёт, что нужно было сделать, когда сдано и когда
 * подтверждено; у ребёнка — на сколько награда приблизила желание. Внизу —
 * куда ушли деньги и кто подтвердил.
 */
export function PaidTaskCard({
  operation,
  viewer,
  approver,
  goal,
  style,
}: PaidTaskCardProps) {
  const { t } = useTranslation();
  const now = useNow();
  const parent = viewer === 'parent';
  const amount = formatAmount(operation.amount);
  const paidAt = new Date(operation.at);
  const doneAt = operation.doneAt ? new Date(operation.doneAt) : null;
  const date = t('time.dayAndTime', {
    day: formatMonthDay(paidAt),
    time: formatClock(paidAt),
  });

  const tiles: InfoTileProps[] = [
    {
      icon: 'sparkle',
      tone: 'green',
      label: t(parent ? 'rewardCard.paidDay' : 'rewardCard.approvedDay', {
        day: formatDayInPhrase(paidAt, now),
      }),
      value: formatClock(paidAt),
    },
  ];
  if (doneAt) {
    tiles.unshift({
      icon: 'calendar',
      tone: 'warm',
      label: t('rewardCard.doneDay', { day: formatDayInPhrase(doneAt, now) }),
      value: formatClock(doneAt),
    });
  }

  return (
    <TaskSheet
      tone="paid"
      avatar={(parent ? operation.child.avatar : approver.avatar) ?? undefined}
      caption={parent ? t('rewardCard.doneBy') : t('taskCard.taskFrom')}
      name={parent ? operation.child.name : approver.name}
      aside={
        <HeroPill
          icon="check"
          label={t(parent ? 'rewardCard.paid' : 'rewardCard.earned', {
            amount,
          })}
        />
      }
      title={operation.title}
      style={style}
      footer={
        <View style={styles.note}>
          <View style={styles.noteIcon}>
            <Icon name="check" size={16} color={theme.colors.white} />
          </View>
          <View style={styles.noteText}>
            <Text style={styles.noteTitle} numberOfLines={1}>
              {parent
                ? t('rewardCard.addedToChild', {
                    amount,
                    name: operation.child.name,
                  })
                : t('rewardCard.addedToYou', { amount })}
            </Text>
            <Text style={styles.noteCaption} numberOfLines={1}>
              {parent
                ? t('rewardCard.approvedBy', { name: approver.name, date })
                : t('rewardCard.parentApproved', { name: approver.name, date })}
            </Text>
          </View>
        </View>
      }
    >
      {operation.photo && (
        <PhotoSection
          label={
            parent
              ? t('taskCard.childPhoto', { name: operation.child.name })
              : t('taskCard.yourPhoto')
          }
          photo={operation.photo}
          height={140}
        />
      )}
      <TaskBrief
        label={t('taskCard.whatToDo')}
        reward={operation.amount}
        paid
        description={operation.description}
      />
      <InfoTiles tiles={tiles} />
      {!parent && goal && <WishProgress goal={goal} />}
    </TaskSheet>
  );
}

/** Полоска желания: синим — сколько было отложено, зелёным — эта награда. */
function WishProgress({ goal }: { goal: RewardGoal }) {
  const { t } = useTranslation();

  return (
    <View style={styles.wish}>
      <LinearGradient
        colors={[theme.colors.childFrom, theme.colors.childDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.wishIcon}
      >
        <Icon name="gift" size={20} color={theme.colors.white} />
      </LinearGradient>
      <View style={styles.wishText}>
        <View style={styles.wishHead}>
          <Text style={styles.wishTitle} numberOfLines={1}>
            {goal.title}
          </Text>
          <Text style={styles.wishNums}>
            {t('rewardCard.wishNums', {
              before: goal.before,
              after: goal.after,
              price: goal.price,
            })}
          </Text>
        </View>
        <View style={styles.track}>
          <View
            style={[styles.saved, { width: percent(goal.before, goal.price) }]}
          />
          <View
            style={[
              styles.added,
              { width: percent(goal.after - goal.before, goal.price) },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

import {
  Image,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@shared/ui';
import {
  formatClock,
  formatCountdown,
  formatDayLabel,
  formatTimeAgo,
  useNow,
} from '@shared/lib';
import { theme } from '@shared/theme';
import type { Task } from '../model';
import { CardHeader, RewardHighlight, TaskInfo } from './task-card-parts';
import { ACTIVE_CARD_GRADIENT, styles } from './task-card.styled';

type TaskCardProps = {
  task: Task;
  style?: StyleProp<ViewStyle>;
};

/** Крупная карточка задания для карусели: активная или ожидающая проверки. */
export function TaskCard({ task, style }: TaskCardProps) {
  return task.status === 'review' ? (
    <ReviewTaskCard task={task} style={style} />
  ) : (
    <ActiveTaskCard task={task} style={style} />
  );
}

// «today» и «yesterday» пишем со строчной буквы внутри фразы, даты — как есть.
function dayInPhrase(date: Date, now: Date) {
  const label = formatDayLabel(date, now);
  return label === 'Today' || label === 'Yesterday'
    ? label.toLowerCase()
    : label;
}

function ActiveTaskCard({ task, style }: TaskCardProps) {
  const now = useNow();
  const created = new Date(task.createdAt);
  const expires = task.expiresAt ? new Date(task.expiresAt) : null;

  return (
    <LinearGradient
      colors={ACTIVE_CARD_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.7071]}
      style={[styles.card, styles.cardActive, style]}
    >
      <CardHeader
        assignee={task.assignee}
        aside={
          expires && (
            <View style={styles.timer}>
              <Text style={styles.timerLabel}>Ends in</Text>
              <Text style={styles.timerValue}>
                {formatCountdown(expires.getTime() - now.getTime())}
              </Text>
            </View>
          )
        }
      />
      <TaskInfo
        task={task}
        meta={`Created ${dayInPhrase(created, now)} · ${formatClock(created)}`}
      />
      <View style={styles.statusBlock}>
        <Text style={styles.caption}>Status</Text>
        <View style={styles.steps}>
          <View style={styles.step}>
            <Icon name="step-dot" size={24} />
            <Text style={[styles.stepLabel, styles.stepLabelCurrent]}>
              Active
            </Text>
          </View>
          <View style={styles.connector}>
            <View style={styles.connectorBar} />
          </View>
          <View style={styles.step}>
            <View style={styles.stepDotNext} />
            <Text style={styles.stepLabel}>Review</Text>
          </View>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.tile}>
          <Text style={styles.caption}>Due</Text>
          <Text style={styles.tileValue}>
            {expires ? formatDayLabel(expires, now) : 'No deadline'}
          </Text>
          {expires && (
            <Text style={styles.tileText}>{formatClock(expires)}</Text>
          )}
        </View>
        <View style={styles.tile}>
          <Text style={styles.tileText}>
            Заглушка. Функционал придумаем и добавим потом
          </Text>
        </View>
      </View>
      <RewardHighlight reward={task.reward} />
    </LinearGradient>
  );
}

function ReviewTaskCard({ task, style }: TaskCardProps) {
  const now = useNow();
  const done = task.doneAt ? new Date(task.doneAt) : null;

  return (
    <LinearGradient
      colors={[theme.colors.reviewFrom, theme.colors.reviewTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.7071]}
      style={[styles.card, styles.cardReview, style]}
    >
      <CardHeader assignee={task.assignee} />
      <TaskInfo
        review
        task={task}
        meta={
          done ? `Marked done · ${formatTimeAgo(done, now)}` : 'Marked done'
        }
      />
      <View style={styles.photo}>
        {task.photo ? (
          <Image
            source={task.photo}
            style={styles.photoImage}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={[theme.colors.photoFrom, theme.colors.photoTo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.photoImage}
          />
        )}
        <View style={styles.photoTag}>
          <Icon name="camera" size={14} color={theme.colors.ink} />
          <Text style={styles.photoTagText}>Photo report</Text>
        </View>
      </View>
      <RewardHighlight reward={task.reward} />
    </LinearGradient>
  );
}

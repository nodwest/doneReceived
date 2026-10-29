import {
  Image,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import {
  formatClock,
  formatCountdown,
  formatDayInPhrase,
  formatTimeAgo,
  useNow,
} from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon, SourceTile, type IconName } from '@shared/ui';
import type { Task, TaskAssignee } from '../model';
import { CardHeader, RewardHighlight, TaskInfo } from './task-card-parts';
import { styles as cardStyles } from './task-card.styled';
import { CHILD_CARD_GRADIENT, styles } from './child-task-card.styled';

type ChildTaskCardProps = {
  task: Task;
  /** Родитель, который дал задание: «Task from Sarah». */
  author: Pick<TaskAssignee, 'name' | 'avatar'>;
  onTakePhoto?: () => void;
  onPickPhoto?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Крупная карточка задания у ребёнка: от кого задание, сколько осталось,
 * описание, фото-отчёт и награда. Активная — голубая, с выбором фото (камера
 * или галерея); на проверке — жёлтая, с отправленным фото.
 */
export function ChildTaskCard({
  task,
  author,
  onTakePhoto,
  onPickPhoto,
  style,
}: ChildTaskCardProps) {
  const { t } = useTranslation();
  const now = useNow();
  const review = task.status === 'review';
  const expires = task.expiresAt ? new Date(task.expiresAt) : null;
  const created = new Date(task.createdAt);
  const done = task.doneAt ? new Date(task.doneAt) : null;

  let meta = t('taskCard.created', {
    day: formatDayInPhrase(created, now),
    time: formatClock(created),
  });
  if (review) {
    meta = done
      ? t('taskCard.markedDoneAgo', { ago: formatTimeAgo(done, now) })
      : t('taskCard.markedDone');
  }

  return (
    <LinearGradient
      colors={
        review
          ? [theme.colors.reviewFrom, theme.colors.reviewTo]
          : CHILD_CARD_GRADIENT
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.7071]}
      style={[
        cardStyles.card,
        review ? cardStyles.cardReview : cardStyles.cardActive,
        style,
      ]}
    >
      <CardHeader
        assignee={author}
        caption={t('taskCard.taskFrom')}
        aside={
          !review &&
          expires && (
            <View style={cardStyles.timer}>
              <Text style={cardStyles.timerLabel}>{t('taskCard.endsIn')}</Text>
              <Text style={[cardStyles.timerValue, styles.timerValue]}>
                {formatCountdown(expires.getTime() - now.getTime())}
              </Text>
            </View>
          )
        }
      />
      <TaskInfo
        task={task}
        meta={meta}
        review={review}
        grow
        iconColor={review ? theme.colors.reviewAccent : theme.colors.childFrom}
      />
      {review ? (
        <View style={cardStyles.photo}>
          {task.photo ? (
            <Image
              source={task.photo}
              style={cardStyles.photoImage}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[theme.colors.photoFrom, theme.colors.photoTo]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={cardStyles.photoImage}
            />
          )}
          <View style={cardStyles.photoTag}>
            <Icon name="camera" size={14} color={theme.colors.ink} />
            <Text style={cardStyles.photoTagText}>
              {t('taskCard.photoReport')}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.report}>
          <View style={styles.reportHead}>
            <Text style={styles.reportTitle}>{t('taskCard.photoReport')}</Text>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{t('tasks.active')}</Text>
            </View>
          </View>
          <View style={styles.dropZone}>
            <ZoneFill />
            <PhotoSource
              icon="camera-outline"
              label={t('taskCard.takePhoto')}
              onPress={onTakePhoto}
            />
            <View style={styles.divider} />
            <PhotoSource
              icon="image-add"
              label={t('taskCard.addFromGallery')}
              onPress={onPickPhoto}
            />
          </View>
          <Text style={styles.hint}>{t('taskCard.photoHint')}</Text>
        </View>
      )}
      <RewardHighlight reward={task.reward} />
    </LinearGradient>
  );
}

type PhotoSourceProps = {
  icon: IconName;
  label: string;
  onPress?: () => void;
};

/** Половина зоны фото: пунктирная плитка с иконкой и подпись под ней. */
function PhotoSource({ icon, label, onPress }: PhotoSourceProps) {
  return (
    <View style={styles.source}>
      <SourceTile icon={icon} accessibilityLabel={label} onPress={onPress} />
      <Text style={styles.sourceLabel}>{label}</Text>
    </View>
  );
}

/** Лёгкая голубая заливка под пунктирной рамкой зоны фото. */
function ZoneFill() {
  return (
    <LinearGradient
      colors={['rgba(74, 158, 240, 0.1)', 'rgba(168, 217, 255, 0.08)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.7071]}
      style={StyleSheet.absoluteFill}
    />
  );
}

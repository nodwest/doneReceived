import type { ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTranslation } from '@shared/i18n';
import { formatClock, formatDayInPhrase, useNow } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon, type IconName } from '@shared/ui';
import type { ChecklistItem, Task, TaskAssignee } from '../model';
import {
  InfoTiles,
  PhotoSection,
  ReviewPill,
  SectionLabel,
  TaskBrief,
  TaskSheet,
  TimerPill,
} from './task-sheet';
import { TaskChecklist } from './task-checklist';
import { styles as sheetStyles } from './task-sheet.styled';
import { styles } from './child-task-card.styled';

type ChildTaskCardProps = {
  task: Task;
  /** Родитель, который дал задание: «Task from Sarah». */
  author: Pick<TaskAssignee, 'name' | 'avatar'>;
  onTakePhoto?: () => void;
  onPickPhoto?: () => void;
  /** Кто из родителей вернул задание (если его возвращали). */
  rejectedBy?: Pick<TaskAssignee, 'name'>;
  /** Ребёнок отметил шаг чеклиста; только у активного задания. */
  onToggleStep?: (item: ChecklistItem) => void;
  /** Кнопка внизу карточки: I did it! или Redo task. */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Крупная карточка задания у ребёнка. Активная — голубая: от кого задание,
 * таймер, описание с наградой, чеклист (шаги отмечаются тапом), срок и когда
 * выдано, фото-отчёт (камера или галерея). На проверке — оранжевая:
 * отправленное фото, описание и чеклист (отметки уже не меняются).
 */
export function ChildTaskCard({
  task,
  author,
  onTakePhoto,
  onPickPhoto,
  rejectedBy,
  onToggleStep,
  footer,
  style,
}: ChildTaskCardProps) {
  const { t } = useTranslation();
  const now = useNow();
  const review = task.status === 'review';
  const expires = task.expiresAt ? new Date(task.expiresAt) : null;
  const created = new Date(task.createdAt);

  return (
    <TaskSheet
      tone={review ? 'review' : 'child'}
      avatar={author.avatar ?? undefined}
      caption={t('taskCard.taskFrom')}
      name={author.name}
      aside={
        review ? (
          <ReviewPill label={t('tasks.onReview')} />
        ) : (
          expires && <TimerPill ms={expires.getTime() - now.getTime()} />
        )
      }
      title={task.title}
      footer={footer}
      style={style}
    >
      {review && task.photo && (
        <PhotoSection label={t('taskCard.yourPhoto')} photo={task.photo} />
      )}
      {!review && task.rejection && (
        <View style={styles.rejection}>
          <View style={styles.rejectionIcon}>
            <Icon name="refresh" size={16} color={theme.colors.dangerText} />
          </View>
          <View style={styles.rejectionText}>
            <Text style={styles.rejectionTitle}>
              {t('taskCard.sentBack', {
                name: rejectedBy?.name ?? author.name,
              })}
            </Text>
            <Text style={styles.rejectionReason}>
              {t(`reviewTask.reasons.${task.rejection.reason}`)}
              {task.rejection.comment ? ` · «${task.rejection.comment}»` : ''}
            </Text>
          </View>
        </View>
      )}
      <TaskBrief
        label={t('taskCard.whatToDo')}
        reward={task.reward}
        description={task.description}
      />
      {task.checklist.length > 0 && (
        <TaskChecklist
          label={t('taskCard.checklist')}
          items={task.checklist}
          progress={t('taskCard.checklistProgress', {
            done: task.checklist.filter((item) => item.done).length,
            total: task.checklist.length,
          })}
          hint={
            review
              ? undefined
              : t('taskCard.checklistChildHint', { name: author.name })
          }
          onToggle={review ? undefined : onToggleStep}
        />
      )}
      {!review && (
        <>
          <InfoTiles
            tiles={[
              {
                icon: 'calendar',
                tone: 'warm',
                label: expires
                  ? t('taskCard.dueDay', {
                      day: formatDayInPhrase(expires, now),
                    })
                  : t('taskCard.due'),
                value: expires
                  ? formatClock(expires)
                  : t('taskCard.noDeadline'),
              },
              {
                icon: 'sparkle',
                tone: 'cool',
                label: t('taskCard.givenDay', {
                  day: formatDayInPhrase(created, now),
                }),
                value: formatClock(created),
              },
            ]}
          />
          <View style={sheetStyles.section}>
            <View style={sheetStyles.sectionHead}>
              <SectionLabel>{t('taskCard.photoReport')}</SectionLabel>
              <View style={styles.optional}>
                <Text style={styles.optionalText}>
                  {t('taskCard.optional')}
                </Text>
              </View>
            </View>
            <View style={styles.drop}>
              <View style={styles.sources}>
                <PhotoSource
                  icon="camera-outline"
                  label={t('taskCard.takePhoto')}
                  onPress={onTakePhoto}
                  variant="camera"
                />
                <PhotoSource
                  icon="image-add"
                  label={t('taskCard.gallery')}
                  onPress={onPickPhoto}
                  variant="gallery"
                />
              </View>
              <Text style={styles.hint}>
                {t('taskCard.photoHint', { name: author.name })}
              </Text>
            </View>
          </View>
        </>
      )}
    </TaskSheet>
  );
}

type PhotoSourceProps = {
  icon: IconName;
  label: string;
  onPress?: () => void;
  variant: 'camera' | 'gallery';
};

/** Кнопка источника фото: камера (голубая) или галерея (белая). */
function PhotoSource({ icon, label, onPress, variant }: PhotoSourceProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.source,
        styles[variant],
        pressed && styles.pressed,
      ]}
    >
      <Icon name={icon} size={20} color={theme.colors.childDeep} />
      <Text style={styles.sourceLabel}>{label}</Text>
    </Pressable>
  );
}

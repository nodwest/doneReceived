import type { ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTranslation } from '@shared/i18n';
import { formatClock, formatDayInPhrase, useNow } from '@shared/lib';
import { theme } from '@shared/theme';
import { ApiImage, Icon, type IconName } from '@shared/ui';
import {
  TASK_PHOTOS_MAX,
  type ChecklistItem,
  type Task,
  type TaskAssignee,
} from '../model';
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
import { TaskNote, TaskNoteField } from './task-note';
import { styles as sheetStyles } from './task-sheet.styled';
import { styles } from './child-task-card.styled';

export type ReportPhotos = {
  items: readonly ImageSourcePropType[];
  /** Можно добавить ещё (меньше TASK_PHOTOS_MAX). */
  canAdd: boolean;
  onTakePhoto: () => void;
  onPickPhoto: () => void;
  onRemove: (index: number) => void;
};

type ChildTaskCardProps = {
  task: Task;
  /** Родитель, который дал задание: «Task from Sarah». */
  author: Pick<TaskAssignee, 'name' | 'avatar'>;
  /**
   * Фото-отчёт, который ребёнок готовит к сдаче (уходит с I did it!): что
   * выбрано, снять, выбрать из галереи, убрать. Без него — только кнопки.
   */
  photos?: ReportPhotos;
  /** Кто из родителей вернул задание (если его возвращали). */
  rejectedBy?: Pick<TaskAssignee, 'name'>;
  /** Ребёнок отметил шаг чеклиста; только у активного задания. */
  onToggleStep?: (item: ChecklistItem) => void;
  /**
   * Комментарий к сдаче, который ребёнок пишет в активной карточке (уходит с
   * I did it!); без него поля нет. На проверке показывается `task.note`.
   */
  note?: { value: string; onChange: (value: string) => void };
  /** Кнопка внизу карточки: I did it! или Redo task. */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Крупная карточка задания у ребёнка. Активная — голубая: от кого задание,
 * таймер, описание с наградой, чеклист (шаги отмечаются тапом), срок и когда
 * выдано, фото-отчёт (камера или галерея) и комментарий для родителя. На
 * проверке — оранжевая: описание, чеклист (отметки уже не меняются),
 * отправленное фото и комментарий.
 */
export function ChildTaskCard({
  task,
  author,
  photos,
  rejectedBy,
  onToggleStep,
  note,
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
      {!review && task.rejection && (
        // Вернули на переделку: кто вернул, причина чипом (у Other её нет —
        // она ничего не говорит) и комментарий родителя словами.
        <View style={styles.rejection}>
          <View style={styles.rejectionIcon}>
            <Icon name="undo" size={16} color={theme.colors.sentBackIcon} />
          </View>
          <View style={styles.rejectionText}>
            <Text style={styles.rejectionTitle}>
              {t('taskCard.sentBack', {
                name: rejectedBy?.name ?? author.name,
              })}
            </Text>
            {task.rejection.reason !== 'other' && (
              <View style={styles.rejectionChip}>
                <Text style={styles.rejectionChipText}>
                  {t(`reviewTask.reasons.${task.rejection.reason}`)}
                </Text>
              </View>
            )}
            {!!task.rejection.comment && (
              <Text style={styles.rejectionComment}>
                {t('taskCard.quote', { text: task.rejection.comment })}
              </Text>
            )}
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
      {review && task.photos.length > 0 && (
        <PhotoSection label={t('taskCard.yourPhoto')} photos={task.photos} />
      )}
      {review && task.note && (
        <TaskNote
          label={t('taskCard.yourNote')}
          note={task.note}
          tone="review"
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
              {photos && photos.items.length > 0 && (
                <View style={styles.picked}>
                  {photos.items.map((photo, index) => (
                    // Фото не переставляются, только убираются: индекс — ключ.
                    <View key={index} style={styles.pickedItem}>
                      <ApiImage source={photo} style={styles.pickedPhoto} />
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={t('wishForm.removePhoto')}
                        hitSlop={8}
                        onPress={() => photos.onRemove(index)}
                        style={styles.pickedRemove}
                      >
                        <Icon
                          name="close"
                          size={8}
                          color={theme.colors.white}
                        />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
              {(!photos || photos.canAdd) && (
                <View style={styles.sources}>
                  <PhotoSource
                    icon="camera-outline"
                    label={t('taskCard.takePhoto')}
                    onPress={photos?.onTakePhoto}
                    variant="camera"
                  />
                  <PhotoSource
                    icon="image-add"
                    label={t('taskCard.gallery')}
                    onPress={photos?.onPickPhoto}
                    variant="gallery"
                  />
                </View>
              )}
              <Text style={styles.hint}>
                {photos && photos.items.length > 0
                  ? t('taskCard.photoCountHint', {
                      count: photos.items.length,
                      max: TASK_PHOTOS_MAX,
                    })
                  : t('taskCard.photoHint', { name: author.name })}
              </Text>
            </View>
          </View>
          {note && (
            <TaskNoteField
              label={t('taskCard.note')}
              optionalLabel={t('taskCard.optional')}
              placeholder={t('taskCard.notePlaceholder')}
              hint={t('taskCard.noteHint')}
              value={note.value}
              onChange={note.onChange}
            />
          )}
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

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from '@shared/i18n';
import {
  formatClock,
  formatDayInPhrase,
  formatTimeAgo,
  useNow,
} from '@shared/lib';
import type { Task } from '../model';
import {
  InfoTiles,
  PhotoSection,
  ReviewPill,
  TaskBrief,
  TaskSheet,
  TimerPill,
} from './task-sheet';
import { TaskChecklist } from './task-checklist';
import { TaskNote } from './task-note';

type TaskCardProps = {
  task: Task;
  /** Кнопки внизу карточки: Cancel task / Edit или Reject / Approve. */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Крупная карточка задания у родителя. Активная — фиолетовая: кому задание,
 * таймер, описание с наградой, чеклист с отметками ребёнка, срок и когда
 * создано. На проверке — оранжевая: когда ребёнок закончил, описание, что он
 * отметил в чеклисте, его фото и комментарий (почему сделано не всё).
 */
export function TaskCard({ task, footer, style }: TaskCardProps) {
  const { t } = useTranslation();
  const now = useNow();
  const created = new Date(task.createdAt);
  const expires = task.expiresAt ? new Date(task.expiresAt) : null;
  const done = task.doneAt ? new Date(task.doneAt) : null;
  const checklist = task.checklist.length > 0 && (
    <TaskChecklist
      label={t('taskCard.checklist')}
      items={task.checklist}
      progress={t('taskCard.checklistProgressDone', {
        done: task.checklist.filter((item) => item.done).length,
        total: task.checklist.length,
      })}
      hint={
        task.status === 'active'
          ? t('taskCard.checklistParentHint', { name: task.assignee.name })
          : undefined
      }
    />
  );

  if (task.status === 'review') {
    return (
      <TaskSheet
        tone="review"
        avatar={task.assignee.avatar ?? undefined}
        caption={
          done
            ? t('tasks.doneAgo', { ago: formatTimeAgo(done, now) })
            : t('taskCard.markedDone')
        }
        name={task.assignee.name}
        aside={<ReviewPill label={t('tasks.onReview')} />}
        title={task.title}
        footer={footer}
        style={style}
      >
        <TaskBrief
          label={t('taskCard.whatToDo')}
          reward={task.reward}
          description={task.description}
        />
        {checklist}
        {task.photos.length > 0 && (
          <PhotoSection
            label={t('taskCard.childPhoto', { name: task.assignee.name })}
            photos={task.photos}
          />
        )}
        {task.note && (
          <TaskNote
            label={t('taskCard.childNote', { name: task.assignee.name })}
            note={task.note}
            tone="review"
          />
        )}
      </TaskSheet>
    );
  }

  return (
    <TaskSheet
      tone="parent"
      avatar={task.assignee.avatar ?? undefined}
      caption={t('taskCard.taskFor')}
      name={task.assignee.name}
      aside={expires && <TimerPill ms={expires.getTime() - now.getTime()} />}
      title={task.title}
      footer={footer}
      style={style}
    >
      <TaskBrief
        label={t('taskCard.whatToDo')}
        reward={task.reward}
        description={task.description}
      />
      {checklist}
      <InfoTiles
        tiles={[
          {
            icon: 'calendar',
            tone: 'warm',
            label: expires
              ? t('taskCard.dueDay', { day: formatDayInPhrase(expires, now) })
              : t('taskCard.due'),
            value: expires ? formatClock(expires) : t('taskCard.noDeadline'),
          },
          {
            icon: 'sparkle',
            tone: 'cool',
            label: t('taskCard.createdDay', {
              day: formatDayInPhrase(created, now),
            }),
            value: formatClock(created),
          },
        ]}
      />
    </TaskSheet>
  );
}

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
  StatusSteps,
  TaskBrief,
  TaskSheet,
  TimerPill,
} from './task-sheet';

type TaskCardProps = {
  task: Task;
  /** Кнопки внизу карточки: Cancel task / Edit или Reject / Approve. */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Крупная карточка задания у родителя. Активная — фиолетовая: кому задание,
 * таймер, описание с наградой, срок и когда создано, шаги статуса. На
 * проверке — оранжевая: когда ребёнок закончил, его фото и описание.
 */
export function TaskCard({ task, footer, style }: TaskCardProps) {
  const { t } = useTranslation();
  const now = useNow();
  const created = new Date(task.createdAt);
  const expires = task.expiresAt ? new Date(task.expiresAt) : null;
  const done = task.doneAt ? new Date(task.doneAt) : null;

  if (task.status === 'review') {
    return (
      <TaskSheet
        tone="review"
        avatar={task.assignee.avatar}
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
        {task.photo && (
          <PhotoSection
            label={t('taskCard.childPhoto', { name: task.assignee.name })}
            photo={task.photo}
          />
        )}
        <TaskBrief
          label={t('taskCard.whatToDo')}
          reward={task.reward}
          description={task.description}
        />
      </TaskSheet>
    );
  }

  return (
    <TaskSheet
      tone="parent"
      avatar={task.assignee.avatar}
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
      <StatusSteps
        label={t('taskCard.status')}
        steps={[t('tasks.active'), t('tasks.onReview'), t('taskCard.paid')]}
        current={0}
      />
    </TaskSheet>
  );
}

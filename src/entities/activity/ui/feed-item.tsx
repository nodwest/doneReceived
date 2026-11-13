import { useTranslation } from '@shared/i18n';
import { useTimeAgo } from '@shared/lib';
import type { FeedEvent, FeedEventType } from '../model';
import { ActivityCard, type ActivityTone } from './activity-card';

/** Сдано — тёплая «на проверке», принято — зелёная, остальное — голубая. */
const tone = (type: FeedEventType): ActivityTone =>
  type === 'task_submitted'
    ? 'pending'
    : type === 'task_approved'
      ? 'approved'
      : 'new';

type FeedItemProps = {
  event: FeedEvent;
  /**
   * Чьими глазами: родитель видит, с каким ребёнком случилось, ребёнок — кто
   * из родителей это сделал.
   */
  viewer: 'parent' | 'child';
};

/** Событие ленты с сервера на главной родителя или ребёнка. */
export function FeedItem({ event, viewer }: FeedItemProps) {
  const { t } = useTranslation();
  const timeAgo = useTimeAgo(event.at);
  const actor = event.byMe
    ? t('activity.feed.you')
    : event.actor.name || t('member.parent');
  const child = event.child?.name ?? '';
  const task = event.title ?? '';

  // Кто рядом с событием: у родителя — ребёнок (у пополнения — сам родитель),
  // у ребёнка — родитель (у своих действий — сам ребёнок).
  const person =
    viewer === 'parent' || event.byMe
      ? (event.child ?? event.actor)
      : event.actor;

  // Под заголовком: когда и кто. Свои действия ребёнка и то, что делает сам
  // ребёнок (отозвал отчёт, добавил желание), — без «кем».
  let extra: string | null = null;
  if (event.type === 'task_submitted') extra = t('activity.pending');
  else if (event.type === 'task_created') {
    extra = t('activity.feed.from', { name: actor });
  } else if (
    event.type !== 'task_withdrawn' &&
    event.type !== 'wish_added' &&
    !(viewer === 'child' && event.byMe)
  ) {
    extra = t('activity.feed.by', { name: actor });
  }

  const { points } = event;
  const amount =
    points === null
      ? ''
      : event.type === 'task_approved' || event.type === 'deposit'
        ? `+$${points}`
        : `$${points}`;

  return (
    <ActivityCard
      tone={tone(event.type)}
      avatar={person.avatar}
      name={person.name}
      title={t(`activity.feed.${viewer}.${event.type}`, { child, task })}
      subtitle={extra ? `${timeAgo} · ${extra}` : timeAgo}
      amount={amount}
    />
  );
}

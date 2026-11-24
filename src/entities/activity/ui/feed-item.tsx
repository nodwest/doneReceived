import { theme, themedValue } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import {
  formatClock,
  formatDayInPhrase,
  formatTimeAgo,
  useNow,
} from '@shared/lib';
import type { FeedCard, FeedEvent, FeedEventType } from '../model';
import { ActivityCard, type ActivityTone } from './activity-card';

/**
 * Сдано — тёплая «на проверке», принято — зелёная, вернули на доработку —
 * коралловая, отменено / закрыто / истекло — графитовая (награды не будет),
 * остальное — голубая.
 */
const TONES: Record<FeedEventType, ActivityTone> = {
  task_created: 'new',
  task_submitted: 'pending',
  task_withdrawn: 'new',
  task_approved: 'approved',
  task_rejected: 'sentBack',
  task_closed: 'missed',
  task_cancelled: 'missed',
  task_expired: 'missed',
  wish_added: 'new',
  deposit: 'new',
  event_created: 'new',
  event_updated: 'new',
  event_cancelled: 'missed',
};

/** Цвет точки статуса на дорожке: каждый шаг задания — свой цвет. */
const DOT_COLORS = themedValue<Record<FeedEventType, string>>(() => ({
  task_created: theme.colors.mapAccent,
  task_submitted: theme.colors.reviewDot,
  task_withdrawn: theme.colors.mapAccent,
  task_approved: theme.colors.earned,
  task_rejected: theme.colors.sentBackIcon,
  task_closed: theme.colors.missed,
  task_cancelled: theme.colors.missed,
  task_expired: theme.colors.missed,
  wish_added: theme.colors.violet,
  deposit: theme.colors.yellow,
  event_created: theme.colors.violet,
  event_updated: theme.colors.violet,
  event_cancelled: theme.colors.missed,
}));

/** Ключи короткого статуса — он дописывается к названию задания. */
const STATUS_KEYS = {
  task_created: 'activity.status.task_created',
  task_submitted: 'activity.status.task_submitted',
  task_withdrawn: 'activity.status.task_withdrawn',
  task_approved: 'activity.status.task_approved',
  task_rejected: 'activity.status.task_rejected',
  task_closed: 'activity.status.task_closed',
  task_cancelled: 'activity.status.task_cancelled',
  task_expired: 'activity.status.task_expired',
  wish_added: 'activity.status.wish_added',
  deposit: 'activity.status.deposit',
  event_created: 'activity.status.event_created',
  event_updated: 'activity.status.event_updated',
  event_cancelled: 'activity.status.event_cancelled',
} as const satisfies Record<FeedEventType, string>;

/** Что делает сам ребёнок: имя берём у него, среди участников его может не быть. */
const CHILD_ACTIONS: ReadonlySet<FeedEventType> = new Set([
  'task_submitted',
  'task_withdrawn',
]);

const MINUTE_MS = 60 * 1000;

type FeedItemProps = {
  /** Задание со всей историей или одиночное событие. */
  card: FeedCard;
  /**
   * Чьими глазами: родитель видит, с каким ребёнком случилось, ребёнок — кто
   * из родителей это сделал.
   */
  viewer: 'parent' | 'child';
  /** Когда: «5 min ago» (главная) или время, если день уже в заголовке. */
  when?: 'ago' | 'clock';
};

const capitalize = (text: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

/** Карточка ленты: одна на задание, со статусом и историей изменений. */
export function FeedItem({ card, viewer, when = 'ago' }: FeedItemProps) {
  const { t } = useTranslation();
  const latest = card.events[0];
  const now = useNow(MINUTE_MS);
  const latestAt = new Date(latest.at);
  const time =
    when === 'clock' ? formatClock(latestAt) : formatTimeAgo(latestAt, now);
  const isTask = latest.assignmentId !== null;

  // Кто рядом с карточкой: у родителя — ребёнок (у пополнения — сам родитель),
  // у ребёнка — родитель (у своих действий — сам ребёнок). Истёкшее задание
  // ребёнку показывает только время: действующего лица у него нет.
  const actorName = latest.byMe
    ? t('activity.feed.you')
    : latest.actor.name || t('member.parent');
  const childName = latest.child?.name ?? '';
  const person =
    viewer === 'parent' || latest.byMe || latest.type === 'task_expired'
      ? (latest.child ?? latest.actor)
      : latest.actor;
  const subtitleName =
    viewer === 'parent'
      ? childName || actorName
      : latest.type === 'task_expired'
        ? ''
        : actorName;
  const subtitle = subtitleName ? `${time} · ${subtitleName}` : time;

  // Сумма одна на задание: в событиях она повторяется, берём ближайшую.
  const points =
    card.events.find((event) => event.points !== null)?.points ?? null;
  const credit =
    latest.type === 'deposit' ||
    (viewer === 'child' && latest.type === 'task_approved');
  const hideAmount = viewer === 'child' && latest.type === 'task_expired';
  const amount =
    points === null || hideAmount ? '' : `${credit ? '+' : ''}$${points}`;

  // Задание — название в кавычках и статус; остальные события — прежний текст.
  const title = isTask
    ? t('activity.taskName', { task: latest.title ?? '' })
    : t(`activity.feed.${viewer}.${latest.type}`, {
        child: childName,
        task: latest.title ?? '',
      });
  const status = isTask ? t(STATUS_KEYS[latest.type]) : undefined;

  // Кто сделал шаг; у истёкшего задания действующего лица нет.
  const whoDid = (event: FeedEvent) => {
    if (event.type === 'task_expired') return '';
    if (event.byMe) return t('activity.feed.you');
    if (CHILD_ACTIONS.has(event.type) && event.child) return event.child.name;
    return event.actor.name || t('member.parent');
  };
  const history = isTask
    ? card.events.map((event) => {
        const at = new Date(event.at);
        const stepTime = t('activity.stepTime', {
          day: formatDayInPhrase(at, now),
          time: formatClock(at),
        });
        const who = whoDid(event);
        return {
          id: event.id,
          label: capitalize(t(STATUS_KEYS[event.type])),
          detail: who ? `${who} · ${stepTime}` : stepTime,
          color: DOT_COLORS[event.type],
        };
      })
    : [];

  return (
    <ActivityCard
      tone={TONES[latest.type]}
      avatar={person.avatar}
      name={person.name}
      title={title}
      status={status}
      subtitle={subtitle}
      amount={amount}
      history={history}
    />
  );
}

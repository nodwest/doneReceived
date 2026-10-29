import { useTranslation } from '@shared/i18n';
import { useTimeAgo } from '@shared/lib';
import type { Activity } from '../model';
import { ActivityCard } from './activity-card';

/** Событие в ленте родителя: что сделал ребёнок. */
export function ActivityItem({
  childName,
  avatar,
  action,
  at,
  status,
  reward,
}: Omit<Activity, 'id'>) {
  const { t } = useTranslation();
  const timeAgo = useTimeAgo(at);
  const pending = status === 'pending';

  // Запись на проверке подсвечена тёплым градиентом, подтверждённая — зелёным.
  return (
    <ActivityCard
      tone={status}
      avatar={avatar}
      title={`${childName} ${action}`}
      subtitle={`${timeAgo} · ${t(`activity.${status}`)}`}
      amount={pending ? `$${reward}` : `+$${reward}`}
    />
  );
}

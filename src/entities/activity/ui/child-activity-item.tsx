import { useTranslation } from '@shared/i18n';
import { useTimeAgo } from '@shared/lib';
import type { ChildActivity } from '../model';
import { ActivityCard } from './activity-card';

const TONES = { review: 'pending', approved: 'approved', new: 'new' } as const;

/** Событие в ленте ребёнка: его задание и родитель, который проверяет или дал его. */
export function ChildActivityItem({
  kind,
  task,
  parentName,
  avatar,
  at,
  reward,
}: Omit<ChildActivity, 'id'>) {
  const { t } = useTranslation();
  const timeAgo = useTimeAgo(at);

  return (
    <ActivityCard
      tone={TONES[kind]}
      avatar={avatar}
      title={t(`activity.child.${kind}`, { task })}
      subtitle={`${timeAgo} · ${t(`activity.child.${kind}By`, { name: parentName })}`}
      amount={kind === 'approved' ? `+$${reward}` : `$${reward}`}
    />
  );
}

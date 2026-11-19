import { useMemo } from 'react';
import { View } from 'react-native';
import { FeedItem, groupFeed, type FeedEvent } from '@entities/activity';
import { useTranslation } from '@shared/i18n';
import { SectionHeader } from '@shared/ui';
import { styles } from './recent-activity.styled';

/** Сколько разных карточек показываем на главной: задания, а не события. */
const HOME_FEED_CARDS = 8;

type RecentActivityProps = {
  /** События ленты с сервера, новые первыми. */
  events: FeedEvent[];
  viewer: 'parent' | 'child';
  onSeeAll?: () => void;
};

/**
 * Лента на главной: события одного задания — одна карточка с историей
 * статусов. Одинаковые статусы больше не повторяются отдельными карточками,
 * поэтому на экран помещается больше разных заданий.
 */
export function RecentActivity({
  events,
  viewer,
  onSeeAll,
}: RecentActivityProps) {
  const { t } = useTranslation();
  const cards = useMemo(
    () => groupFeed(events).slice(0, HOME_FEED_CARDS),
    [events],
  );

  if (cards.length === 0) return null;

  return (
    <View style={styles.container}>
      <SectionHeader
        title={t('home.recentActivity')}
        actionLabel={t('common.seeAll')}
        onAction={onSeeAll}
      />
      <View style={styles.list}>
        {cards.map((card) => (
          <FeedItem key={card.key} card={card} viewer={viewer} />
        ))}
      </View>
    </View>
  );
}

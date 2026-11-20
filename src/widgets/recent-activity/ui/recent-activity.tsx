import { useMemo } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { FeedItem, groupFeed, type FeedEvent } from '@entities/activity';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { SectionHeader } from '@shared/ui';
import { styles } from './recent-activity.styled';

/** Сколько разных карточек показываем на главной: задания, а не события. */
const HOME_FEED_CARDS = 8;

type RecentActivityProps = {
  /** События ленты с сервера, новые первыми. */
  events: FeedEvent[];
  viewer: 'parent' | 'child';
  /** Первая загрузка: показываем заглушку, а не пустое место. */
  isLoading?: boolean;
  /** Лента не загрузилась: даём повторить. */
  isError?: boolean;
  onRetry?: () => void;
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
  isLoading = false,
  isError = false,
  onRetry,
  onSeeAll,
}: RecentActivityProps) {
  const { t } = useTranslation();
  const cards = useMemo(
    () => groupFeed(events).slice(0, HOME_FEED_CARDS),
    [events],
  );

  if (cards.length === 0 && !isLoading && !isError) return null;

  return (
    <View style={styles.container}>
      <SectionHeader
        title={t('home.recentActivity')}
        actionLabel={t('common.seeAll')}
        onAction={onSeeAll}
      />
      {cards.length === 0 ? (
        <View style={styles.state}>
          {isLoading ? (
            <>
              <ActivityIndicator color={theme.colors.blueInk} />
              <Text style={styles.stateText}>{t('activity.loading')}</Text>
            </>
          ) : (
            <>
              <Text style={styles.stateText}>{t('activity.loadError')}</Text>
              {onRetry && (
                <Pressable
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={onRetry}
                >
                  <Text style={styles.retry}>{t('common.retry')}</Text>
                </Pressable>
              )}
            </>
          )}
        </View>
      ) : (
        <View style={styles.list}>
          {cards.map((card) => (
            <FeedItem key={card.key} card={card} viewer={viewer} />
          ))}
        </View>
      )}
    </View>
  );
}

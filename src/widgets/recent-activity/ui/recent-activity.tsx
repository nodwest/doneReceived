import { View } from 'react-native';
import { ActivityItem, type Activity } from '@entities/activity';
import { useTranslation } from '@shared/i18n';
import { SectionHeader } from '@shared/ui';
import { styles } from './recent-activity.styled';

type RecentActivityProps = {
  items: readonly Activity[];
  onSeeAll?: () => void;
};

export function RecentActivity({ items, onSeeAll }: RecentActivityProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <SectionHeader
        title={t('home.recentActivity')}
        actionLabel={t('common.seeAll')}
        onAction={onSeeAll}
      />
      <View style={styles.list}>
        {items.map(({ id, ...item }) => (
          <ActivityItem key={id} {...item} />
        ))}
      </View>
    </View>
  );
}

import { View } from 'react-native';
import { ActivityItem, type Activity } from '@entities/activity';
import { SectionHeader } from '@shared/ui';
import { styles } from './recent-activity.styled';

type RecentActivityProps = {
  items: readonly Activity[];
  onSeeAll?: () => void;
};

export function RecentActivity({ items, onSeeAll }: RecentActivityProps) {
  return (
    <View style={styles.container}>
      <SectionHeader
        title="Recent Activity"
        actionLabel="See all"
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

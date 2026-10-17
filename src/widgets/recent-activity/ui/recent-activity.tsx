import { Pressable, Text, View } from 'react-native';
import { ActivityItem, type Activity } from '@entities/activity';
import { styles } from './recent-activity.styled';

type RecentActivityProps = {
  items: readonly Activity[];
  onSeeAll?: () => void;
};

export function RecentActivity({ items, onSeeAll }: RecentActivityProps) {
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.title}>Recent Activity</Text>
        <Pressable onPress={onSeeAll}>
          <Text style={styles.link}>See all</Text>
        </Pressable>
      </View>
      <View style={styles.list}>
        {items.map(({ id, ...item }) => (
          <ActivityItem key={id} {...item} />
        ))}
      </View>
    </View>
  );
}

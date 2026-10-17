import { Text, View } from 'react-native';
import type { Activity } from '../model';
import { styles } from './activity-item.styled';

const STATUS_LABEL = {
  pending: 'Pending review',
  approved: 'Approved',
} as const;

export function ActivityItem({
  childName,
  avatarColor,
  action,
  timeAgo,
  status,
  reward,
}: Omit<Activity, 'id'>) {
  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarLetter}>{childName.charAt(0)}</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.title}>
          {childName} {action}
        </Text>
        <Text
          style={[
            styles.subtitle,
            status === 'approved' && styles.subtitleApproved,
          ]}
        >
          {timeAgo} · {STATUS_LABEL[status]}
        </Text>
      </View>
      <Text style={styles.reward}>+${reward}</Text>
    </View>
  );
}

import { Image, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';
import type { Activity } from '../model';
import { styles } from './activity-item.styled';

const STATUS_LABEL = {
  pending: 'Pending review',
  approved: 'Approved',
} as const;

export function ActivityItem({
  childName,
  avatar,
  action,
  timeAgo,
  status,
  reward,
}: Omit<Activity, 'id'>) {
  const pending = status === 'pending';

  // Запись на проверке подсвечена тёплым градиентом, подтверждённая — зелёным.
  return (
    <LinearGradient
      colors={
        pending
          ? [theme.colors.reviewFrom, theme.colors.reviewTo]
          : [theme.colors.approvedFrom, theme.colors.approvedTo]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.7071]}
      style={[styles.container, pending ? styles.pending : styles.approved]}
    >
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.middle}>
        <Text style={styles.title}>
          {childName} {action}
        </Text>
        <Text style={[styles.subtitle, !pending && styles.subtitleApproved]}>
          {timeAgo} · {STATUS_LABEL[status]}
        </Text>
      </View>
      <Text style={[styles.reward, pending && styles.rewardPending]}>
        {pending ? `$${reward}` : `+$${reward}`}
      </Text>
    </LinearGradient>
  );
}

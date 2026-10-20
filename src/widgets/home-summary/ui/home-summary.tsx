import { View } from 'react-native';
import { Icon } from '@shared/ui';
import { theme } from '@shared/theme';
import { StatCard } from './stat-card';
import { styles } from './home-summary.styled';

type HomeSummaryProps = {
  rewardsPaid: number;
  activeTasks: number;
  tasksToReview: number;
  onActiveTasksPress?: () => void;
  onTasksToReviewPress?: () => void;
};

export function HomeSummary({
  rewardsPaid,
  activeTasks,
  tasksToReview,
  onActiveTasksPress,
  onTasksToReviewPress,
}: HomeSummaryProps) {
  return (
    <View style={styles.container}>
      <StatCard
        accent
        icon={<Icon name="coins" size={20} color={theme.colors.white} />}
        value={`$${rewardsPaid}`}
        label="Rewards paid"
      />
      <StatCard
        icon={<Icon name="tasks" size={20} color={theme.colors.blue} />}
        value={String(activeTasks)}
        label="Active tasks"
        onPress={onActiveTasksPress}
      />
      <StatCard
        highlight
        icon={<Icon name="cheque" size={20} color={theme.colors.violet} />}
        value={String(tasksToReview)}
        label="Tasks to Review"
        onPress={onTasksToReviewPress}
      />
    </View>
  );
}

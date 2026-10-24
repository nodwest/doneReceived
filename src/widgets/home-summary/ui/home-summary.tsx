import { View } from 'react-native';
import { Icon } from '@shared/ui';
import { theme } from '@shared/theme';
import { StatCard } from './stat-card';
import { styles } from './home-summary.styled';

type HomeSummaryProps = {
  /** Сумма на первой плитке: выплачено семьёй или баланс ребёнка. */
  amount: number;
  amountLabel?: string;
  activeTasks: number;
  /** Задачи на проверке; без значения плитки нет (профиль родителя). */
  tasksToReview?: number;
  onActiveTasksPress?: () => void;
  onTasksToReviewPress?: () => void;
};

export function HomeSummary({
  amount,
  amountLabel = 'Rewards paid',
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
        value={`$${amount}`}
        label={amountLabel}
      />
      <StatCard
        icon={<Icon name="tasks" size={20} color={theme.colors.blue} />}
        value={String(activeTasks)}
        label="Active tasks"
        onPress={onActiveTasksPress}
      />
      {tasksToReview !== undefined && (
        <StatCard
          highlight
          icon={<Icon name="cheque" size={20} color={theme.colors.violet} />}
          value={String(tasksToReview)}
          label="Tasks to Review"
          onPress={onTasksToReviewPress}
        />
      )}
    </View>
  );
}

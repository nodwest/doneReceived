import { View } from 'react-native';
import { useTranslation } from '@shared/i18n';
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
  /** Подпись плитки проверки: «Tasks to Review» у родителя, «On review» у ребёнка. */
  reviewLabel?: string;
  onActiveTasksPress?: () => void;
  onTasksToReviewPress?: () => void;
  /** Первая плитка: фиолетовая у родителя, голубая у ребёнка. */
  tone?: 'parent' | 'child';
};

export function HomeSummary({
  amount,
  amountLabel,
  activeTasks,
  tasksToReview,
  reviewLabel,
  onActiveTasksPress,
  onTasksToReviewPress,
  tone = 'parent',
}: HomeSummaryProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <StatCard
        accent={tone}
        icon={<Icon name="coins" size={20} color={theme.colors.white} />}
        value={`$${amount}`}
        label={amountLabel ?? t('summary.rewardsPaid')}
      />
      <StatCard
        icon={<Icon name="tasks" size={20} color={theme.colors.blue} />}
        value={String(activeTasks)}
        label={t('summary.activeTasks')}
        onPress={onActiveTasksPress}
      />
      {tasksToReview !== undefined && (
        <StatCard
          highlight
          icon={<Icon name="cheque" size={20} color={theme.colors.violet} />}
          value={String(tasksToReview)}
          label={reviewLabel ?? t('summary.tasksToReview')}
          onPress={onTasksToReviewPress}
        />
      )}
    </View>
  );
}

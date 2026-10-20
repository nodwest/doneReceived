import type { ReactNode } from 'react';
import { Image, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@shared/ui';
import { useIsCompact } from '@shared/lib';
import { theme } from '@shared/theme';
import { formatReward, type Task, type TaskAssignee } from '../model';
import { styles } from './task-card.styled';

type CardHeaderProps = {
  assignee: TaskAssignee;
  /** Блок справа (таймер). */
  aside?: ReactNode;
};

export function CardHeader({ assignee, aside }: CardHeaderProps) {
  const compact = useIsCompact();

  return (
    <View style={styles.header}>
      <Image source={assignee.avatar} style={styles.avatar} />
      <View style={styles.nameWrap}>
        <Text
          style={[styles.name, compact && styles.nameCompact]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {assignee.name}
        </Text>
      </View>
      {aside}
    </View>
  );
}

type TaskInfoProps = {
  task: Pick<Task, 'title' | 'description'>;
  meta: string;
  review?: boolean;
};

export function TaskInfo({ task, meta, review }: TaskInfoProps) {
  return (
    <View style={[styles.taskBlock, review && styles.taskBlockReview]}>
      <View style={styles.taskRow}>
        <Icon name="broom" size={24} color={theme.colors.violet} />
        <View style={styles.taskText}>
          <Text style={styles.title}>{task.title}</Text>
          {!!task.description && (
            <Text style={styles.description}>{task.description}</Text>
          )}
          <Text style={styles.meta}>{meta}</Text>
        </View>
      </View>
    </View>
  );
}

export function RewardHighlight({ reward }: { reward: number }) {
  return (
    <LinearGradient
      colors={[theme.colors.yellowSoft, '#FFFBF0']}
      start={{ x: 0.4, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      locations={[0, 0.7071]}
      style={styles.reward}
    >
      <View style={styles.rewardRow}>
        <Icon name="coin" size={28} color={theme.colors.yellow} />
        <Text style={styles.rewardValue}>{formatReward(reward)}</Text>
      </View>
    </LinearGradient>
  );
}

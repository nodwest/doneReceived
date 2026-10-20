import {
  Image,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@shared/ui';
import { theme } from '@shared/theme';
import type { ChildOverview } from '../model/child-overview';
import { styles } from './child-card.styled';

type ChildCardProps = {
  child: ChildOverview;
  style?: StyleProp<ViewStyle>;
};

export function ChildCard({ child, style }: ChildCardProps) {
  const { name, avatar, activeTasks, reviewTasks, atHome } = child;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.child}>
        <Image source={avatar} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{activeTasks}</Text>
          <Text style={styles.statLabel}>active tasks</Text>
        </View>
        <View style={[styles.stat, styles.statReview]}>
          <Text style={[styles.statValue, styles.statReviewText]}>
            {reviewTasks}
          </Text>
          <Text style={[styles.statLabel, styles.statReviewText]}>
            tasks to review
          </Text>
        </View>
      </View>
      {atHome && (
        <LinearGradient
          colors={[theme.colors.homeFrom, theme.colors.homeTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.homeBadge}
        >
          <Icon name="home" size={20} color={theme.colors.homeBrown} />
        </LinearGradient>
      )}
    </View>
  );
}

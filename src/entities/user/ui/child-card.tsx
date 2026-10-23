import {
  Image,
  Platform,
  Pressable,
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
  /** Тап по карточке мимо чипов — открыть профиль ребёнка. */
  onPress?: () => void;
  /** Тап по чипу «active tasks». */
  onActiveTasksPress?: () => void;
  /** Тап по чипу «tasks to review». */
  onReviewTasksPress?: () => void;
};

export function ChildCard({
  child,
  style,
  onPress,
  onActiveTasksPress,
  onReviewTasksPress,
}: ChildCardProps) {
  const { name, avatar, activeTasks, reviewTasks, atHome } = child;

  return (
    <Pressable
      // В вебе роль button делает из карточки <button>, а внутри неё кнопки-чипы:
      // вложенные <button> HTML запрещает. Там карточка остаётся просто
      // нажимаемым блоком.
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      accessibilityLabel={name}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      <View style={styles.child}>
        <Image source={avatar} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
      </View>
      {/* Чипы — отдельные кнопки внутри карточки: тап по ним не открывает профиль. */}
      <View style={styles.stats}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${name}: ${activeTasks} active tasks`}
          disabled={!onActiveTasksPress}
          onPress={onActiveTasksPress}
          style={({ pressed }) => [styles.stat, pressed && styles.pressed]}
        >
          <Text style={styles.statValue}>{activeTasks}</Text>
          <Text style={styles.statLabel}>active tasks</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${name}: ${reviewTasks} tasks to review`}
          disabled={!onReviewTasksPress}
          onPress={onReviewTasksPress}
          style={({ pressed }) => [
            styles.stat,
            styles.statReview,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.statValue, styles.statReviewText]}>
            {reviewTasks}
          </Text>
          <Text style={[styles.statLabel, styles.statReviewText]}>
            tasks to review
          </Text>
        </Pressable>
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
    </Pressable>
  );
}

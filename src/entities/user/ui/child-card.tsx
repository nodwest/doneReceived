import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTranslation } from '@shared/i18n';
import { LetterAvatar } from '@shared/ui';
import { formatClock, formatMonthDay } from '@shared/lib';
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
  const { t } = useTranslation();
  const {
    name,
    avatar,
    activeTasks,
    reviewTasks,
    locationName,
    lastLocationAt,
  } = child;

  const locationTime =
    lastLocationAt &&
    t('home.lastLocation', {
      date: formatMonthDay(lastLocationAt),
      time: formatClock(lastLocationAt),
    });

  return (
    <View style={[styles.card, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={[name, locationName, locationTime]
          .filter(Boolean)
          .join('. ')}
        disabled={!onPress}
        onPress={onPress}
        style={({ pressed }) => [styles.child, pressed && styles.pressed]}
      >
        <LetterAvatar
          source={avatar}
          name={name}
          style={styles.avatar}
          letterSize={22}
        />
        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          {locationName && (
            <Text style={styles.place} numberOfLines={2}>
              {locationName}
            </Text>
          )}
          {lastLocationAt && <Text style={styles.meta}>{locationTime}</Text>}
        </View>
      </Pressable>
      <View style={styles.stats}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('childCard.activeTasksA11y', {
            name,
            count: activeTasks,
          })}
          disabled={!onActiveTasksPress}
          onPress={onActiveTasksPress}
          style={({ pressed }) => [styles.stat, pressed && styles.pressed]}
        >
          <Text style={styles.statValue}>{activeTasks}</Text>
          <Text style={styles.statLabel}>{t('home.activeShort')}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('childCard.tasksToReviewA11y', {
            name,
            count: reviewTasks,
          })}
          disabled={!onReviewTasksPress}
          onPress={onReviewTasksPress}
          style={({ pressed }) => [styles.stat, pressed && styles.pressed]}
        >
          <Text style={[styles.statValue, styles.statReviewText]}>
            {reviewTasks}
          </Text>
          <Text style={styles.statLabel}>{t('home.reviewShort')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

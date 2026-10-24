import {
  Image,
  Platform,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import type { Presence } from '../model/presence';
import type { FamilyRole } from '../model/role';
import { PresenceBadge } from './presence-badge';
import { RoleTint } from './role-tint';
import { styles } from './member-card.styled';

type MemberCardProps = {
  name: string;
  avatar: ImageSourcePropType;
  role: FamilyRole;
  presence: Presence;
  /** Карточка самого пользователя: рядом с именем метка «You». */
  isYou?: boolean;
  activeTasks: number;
  /** Задачи на проверке — только у детей; без значения чип не показываем. */
  reviewTasks?: number;
  /** Тап по карточке мимо чипов — открыть профиль. */
  onPress?: () => void;
  onActiveTasksPress?: () => void;
  onReviewTasksPress?: () => void;
};

/** Карточка участника семьи на вкладке Family: родитель или ребёнок. */
export function MemberCard({
  name,
  avatar,
  role,
  presence,
  isYou,
  activeTasks,
  reviewTasks,
  onPress,
  onActiveTasksPress,
  onReviewTasksPress,
}: MemberCardProps) {
  return (
    <Pressable
      // В вебе роль button делает из карточки <button>, а внутри неё кнопки-чипы:
      // вложенные <button> HTML запрещает.
      accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
      accessibilityLabel={name}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <RoleTint role={role} style={styles.card}>
        <Image source={avatar} style={styles.avatar} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {isYou && (
              <View style={styles.you}>
                <Text style={styles.youText}>You</Text>
              </View>
            )}
          </View>
          <PresenceBadge {...presence} compact />
        </View>
        <View style={styles.stats}>
          <TaskChip
            value={activeTasks}
            label="active"
            accessibilityLabel={`${name}: ${activeTasks} active tasks`}
            onPress={onActiveTasksPress}
          />
          {reviewTasks !== undefined && (
            <TaskChip
              value={reviewTasks}
              label="to review"
              accessibilityLabel={`${name}: ${reviewTasks} tasks to review`}
              onPress={onReviewTasksPress}
              chipStyle={styles.chipReview}
              textStyle={styles.chipReviewText}
            />
          )}
        </View>
      </RoleTint>
    </Pressable>
  );
}

type TaskChipProps = {
  value: number;
  label: string;
  accessibilityLabel: string;
  onPress?: () => void;
  chipStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/** Чип со счётчиком задач — отдельная кнопка: тап не открывает профиль. */
function TaskChip({
  value,
  label,
  accessibilityLabel,
  onPress,
  chipStyle,
  textStyle,
}: TaskChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        chipStyle,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.chipValue, textStyle]}>{value}</Text>
      <Text style={[styles.chipLabel, textStyle]}>{label}</Text>
    </Pressable>
  );
}

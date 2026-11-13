import type { ReactNode } from 'react';
import { ApiImage } from '@shared/ui';
import {
  Platform,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useTranslation } from '@shared/i18n';
import type { Presence } from '../model/presence';
import type { FamilyRole } from '../model/role';
import { PresenceBadge } from './presence-badge';
import { RoleTint } from './role-tint';
import { styles } from './member-card.styled';

type MemberCardProps = {
  name: string;
  /** Фото; без него — первая буква имени в кружке. */
  avatar?: ImageSourcePropType;
  role: FamilyRole;
  /** Статус «дома»; без него под именем — `subtitle`. */
  presence?: Presence;
  /** Строка под именем, если статуса нет: «Added today». */
  subtitle?: string;
  /** Карточка самого пользователя: рядом с именем метка «You». */
  isYou?: boolean;
  /** Активные задачи; без значения чипов задач нет (новый ребёнок). */
  activeTasks?: number;
  /** Задачи на проверке — только у детей; без значения чип не показываем. */
  reviewTasks?: number;
  /** Тап по карточке мимо чипов — открыть профиль. */
  onPress?: () => void;
  onActiveTasksPress?: () => void;
  onReviewTasksPress?: () => void;
  /** Низ карточки под чертой: устройства ребёнка. */
  footer?: ReactNode;
};

/**
 * Карточка участника семьи на вкладке Family: родитель или ребёнок. Тап по
 * верхней части открывает профиль; низ (`footer`) — отдельная часть со
 * своими кнопками.
 */
export function MemberCard({
  name,
  avatar,
  role,
  presence,
  subtitle,
  isYou,
  activeTasks,
  reviewTasks,
  onPress,
  onActiveTasksPress,
  onReviewTasksPress,
  footer,
}: MemberCardProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.shadow}>
      <RoleTint role={role} style={styles.card}>
        <Pressable
          // В вебе роль button делает из карточки <button>, а внутри неё
          // кнопки-чипы: вложенные <button> HTML запрещает.
          accessibilityRole={Platform.OS === 'web' ? undefined : 'button'}
          accessibilityLabel={name}
          disabled={!onPress}
          onPress={onPress}
          style={({ pressed }) => [styles.main, pressed && styles.pressed]}
        >
          {avatar ? (
            <ApiImage source={avatar} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.initial]}>
              <Text style={styles.initialText}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              {isYou && (
                <View style={styles.you}>
                  <Text style={styles.youText}>{t('member.you')}</Text>
                </View>
              )}
            </View>
            {presence ? (
              <PresenceBadge {...presence} compact />
            ) : (
              subtitle && (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {subtitle}
                </Text>
              )
            )}
          </View>
          {activeTasks !== undefined && (
            <View style={styles.stats}>
              <TaskChip
                value={activeTasks}
                label={t('member.active', { count: activeTasks })}
                accessibilityLabel={t('childCard.activeTasksA11y', {
                  name,
                  count: activeTasks,
                })}
                onPress={onActiveTasksPress}
              />
              {/* Нечего проверять — чип не показываем. */}
              {reviewTasks !== undefined && reviewTasks > 0 && (
                <TaskChip
                  value={reviewTasks}
                  label={t('member.toReview')}
                  accessibilityLabel={t('childCard.tasksToReviewA11y', {
                    name,
                    count: reviewTasks,
                  })}
                  onPress={onReviewTasksPress}
                  chipStyle={styles.chipReview}
                  textStyle={styles.chipReviewText}
                />
              )}
            </View>
          )}
        </Pressable>
        {footer && <View style={styles.footer}>{footer}</View>}
      </RoleTint>
    </View>
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

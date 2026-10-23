import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RoundButton } from '@shared/ui';
import { useIsCompact } from '@shared/lib';
import { theme } from '@shared/theme';
import { styles } from './tasks-header.styled';

export type TasksTab = 'all' | 'review';
export type TasksView = 'cards' | 'list';

type TasksHeaderProps = {
  tab: TasksTab;
  onTabChange: (tab: TasksTab) => void;
  /** Сколько заданий ждёт проверки: число на бейдже. */
  reviewCount: number;
  view: TasksView;
  onToggleView: () => void;
  onBack: () => void;
  /** Чей список: под шапкой строка с аватаром и «Emma's tasks». */
  owner?: { name: string; avatar: ImageSourcePropType };
};

/** Шапка экрана заданий: назад, переключатель All / Review и вид списком. */
export function TasksHeader({
  tab,
  onTabChange,
  reviewCount,
  view,
  onToggleView,
  onBack,
  owner,
}: TasksHeaderProps) {
  const compact = useIsCompact();
  const allActive = tab === 'all';
  const reviewActive = tab === 'review';

  return (
    <View>
      <View style={styles.container}>
        <RoundButton
          icon="arrow-left"
          accessibilityLabel="Back"
          onPress={onBack}
        />

        <View style={styles.segments} accessibilityRole="tablist">
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="All tasks"
            accessibilityState={{ selected: allActive }}
            onPress={() => onTabChange('all')}
            style={[
              styles.segment,
              compact && styles.segmentCompact,
              allActive && styles.segmentAllActive,
            ]}
          >
            {allActive && (
              <LinearGradient
                colors={[theme.colors.violet, theme.colors.blue]}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 1, y: 0.9 }}
                locations={[0, 0.7071]}
                style={StyleSheet.absoluteFill}
              />
            )}
            <SegmentLabel
              label="All tasks"
              compact={compact}
              activeStyle={allActive && styles.segmentLabelAll}
            />
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="Review Tasks"
            accessibilityState={{ selected: reviewActive }}
            onPress={() => onTabChange('review')}
            style={[
              styles.segment,
              compact && styles.segmentCompact,
              reviewCount > 0 && styles.segmentWithBadge,
              reviewActive && styles.segmentReviewActive,
            ]}
          >
            {reviewActive && (
              <LinearGradient
                colors={[theme.colors.reviewFrom, theme.colors.reviewTo]}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 1, y: 0.9 }}
                locations={[0, 0.7071]}
                style={StyleSheet.absoluteFill}
              />
            )}
            {/* На узких экранах полная подпись не помещается рядом с кнопками. */}
            <SegmentLabel
              label={compact ? 'Review' : 'Review Tasks'}
              compact={compact}
              activeStyle={reviewActive && styles.segmentLabelReview}
            />
            {reviewCount > 0 && (
              <LinearGradient
                colors={[theme.colors.violet, theme.colors.blue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.7071]}
                style={styles.badge}
              >
                <Text style={styles.badgeText}>{reviewCount}</Text>
              </LinearGradient>
            )}
          </Pressable>
        </View>

        <RoundButton
          icon={view === 'cards' ? 'list' : 'cards'}
          accessibilityLabel={
            view === 'cards' ? 'Show as list' : 'Show as cards'
          }
          onPress={onToggleView}
        />
      </View>
      {owner && (
        <View style={styles.owner}>
          <Image source={owner.avatar} style={styles.ownerAvatar} />
          <Text style={styles.ownerName}>{owner.name}&apos;s tasks</Text>
        </View>
      )}
    </View>
  );
}

type SegmentLabelProps = {
  label: string;
  compact: boolean;
  /** Стиль выбранного сегмента (жирный и цветной); false — обычный. */
  activeStyle: StyleProp<TextStyle>;
};

/**
 * Подпись сегмента. Выбранная подпись жирная, а жирный текст шире: без
 * распорки граница между сегментами сдвигалась бы при каждом переключении.
 * Ширину всегда задаёт невидимая жирная копия, видимый текст лежит поверх.
 */
function SegmentLabel({ label, compact, activeStyle }: SegmentLabelProps) {
  const base = [styles.segmentLabel, compact && styles.segmentLabelCompact];

  return (
    <View>
      <Text
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        aria-hidden
        style={[base, styles.segmentLabelBold, styles.segmentLabelSizer]}
      >
        {label}
      </Text>
      <Text style={[base, activeStyle, styles.segmentLabelOverlay]}>
        {label}
      </Text>
    </View>
  );
}

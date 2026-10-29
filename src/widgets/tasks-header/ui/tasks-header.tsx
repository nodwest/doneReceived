import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
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
  /** Чей список: строка с аватаром и «Emma's tasks». */
  owner?: Owner;
  /**
   * Переключатель All / Review. Без него (задачи родителя — только активные)
   * «George's tasks» стоит по центру шапки, а не строкой под ней.
   */
  tabs?: boolean;
  /** Цвет выбранного All и бейджа: фиолетовый у родителя, голубой у ребёнка. */
  tone?: Tone;
};

type Tone = 'parent' | 'child';

const TONE_GRADIENTS = {
  parent: [theme.colors.violet, theme.colors.blue],
  child: [theme.colors.childFrom, theme.colors.childDeep],
} as const;

type Owner = { name: string; avatar: ImageSourcePropType };

/** Шапка экрана заданий: назад, переключатель All / Review и вид списком. */
export function TasksHeader({
  tab,
  onTabChange,
  reviewCount,
  view,
  onToggleView,
  onBack,
  owner,
  tabs = true,
  tone = 'parent',
}: TasksHeaderProps) {
  const { t } = useTranslation();
  return (
    <View>
      <View style={[styles.container, !tabs && styles.containerInline]}>
        <RoundButton
          icon="arrow-left"
          accessibilityLabel={t('common.back')}
          onPress={onBack}
        />

        {tabs ? (
          <Segments
            tab={tab}
            onTabChange={onTabChange}
            reviewCount={reviewCount}
            tone={tone}
          />
        ) : (
          owner && <OwnerTitle {...owner} style={styles.ownerInline} />
        )}

        <RoundButton
          icon={view === 'cards' ? 'list' : 'cards'}
          accessibilityLabel={
            view === 'cards' ? t('tasks.showAsList') : t('tasks.showAsCards')
          }
          onPress={onToggleView}
        />
      </View>
      {tabs && owner && <OwnerTitle {...owner} style={styles.owner} />}
    </View>
  );
}

type SegmentsProps = Pick<
  TasksHeaderProps,
  'tab' | 'onTabChange' | 'reviewCount'
> & { tone: Tone };

/** Переключатель All / Review с бейджем задач на проверке. */
function Segments({ tab, onTabChange, reviewCount, tone }: SegmentsProps) {
  const { t } = useTranslation();
  const compact = useIsCompact();
  const allActive = tab === 'all';
  const reviewActive = tab === 'review';

  return (
    <View style={styles.segments} accessibilityRole="tablist">
      <Pressable
        accessibilityRole="tab"
        accessibilityLabel={t('tasks.allTasks')}
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
            colors={TONE_GRADIENTS[tone]}
            start={{ x: 0, y: 0.1 }}
            end={{ x: 1, y: 0.9 }}
            locations={[0, 0.7071]}
            style={StyleSheet.absoluteFill}
          />
        )}
        <SegmentLabel
          label={t('tasks.allTasks')}
          compact={compact}
          activeStyle={allActive && styles.segmentLabelAll}
        />
      </Pressable>

      <Pressable
        accessibilityRole="tab"
        accessibilityLabel={t('tasks.reviewTasks')}
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
          label={
            compact
              ? t('tasks.review')
              : tone === 'child'
                ? t('tasks.onReview')
                : t('tasks.reviewTasks')
          }
          compact={compact}
          activeStyle={reviewActive && styles.segmentLabelReview}
        />
        {reviewCount > 0 && (
          <LinearGradient
            colors={TONE_GRADIENTS[tone]}
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
  );
}

/** Аватар и «Emma's tasks». */
function OwnerTitle({
  name,
  avatar,
  style,
}: Owner & { style: StyleProp<ViewStyle> }) {
  const { t } = useTranslation();
  return (
    <View style={style}>
      <Image source={avatar} style={styles.ownerAvatar} />
      <Text style={styles.ownerName} numberOfLines={1}>
        {t('tasks.ownerTasks', { name })}
      </Text>
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

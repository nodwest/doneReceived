import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  type LayoutRectangle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useTranslation } from '@shared/i18n';
import { LetterAvatar, RoundButton } from '@shared/ui';
import { useIsCompact } from '@shared/lib';
import { theme, themedArray } from '@shared/theme';
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
  /** Подпись вкладки проверки: Review Tasks у родителя, On review у ребёнка. */
  tone?: Tone;
};

type Tone = 'parent' | 'child';

/** Выбранный All и бейдж счётчика — синие у родителя и у ребёнка. */
const ACCENT_GRADIENT = themedArray<readonly [string, string]>(() => [
  theme.colors.childFrom,
  theme.colors.childDeep,
]);

/** Чьи задания; avatar null — первая буква имени (ребёнок с сервера). */
type Owner = { name: string; avatar: ImageSourcePropType | null };

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
  const reduceMotion = useReducedMotion();

  // Плашка выбранного сегмента едет между кнопками; ширина у них разная,
  // поэтому анимируются и положение, и ширина.
  const progress = useSharedValue(allActive ? 0 : 1);
  const [layouts, setLayouts] = useState<
    Record<'all' | 'review', LayoutRectangle | null>
  >({ all: null, review: null });

  useEffect(() => {
    progress.value = withTiming(allActive ? 0 : 1, {
      duration: reduceMotion ? 0 : 240,
      easing: Easing.out(Easing.cubic),
    });
  }, [allActive, progress, reduceMotion]);

  const measure = (key: 'all' | 'review') => (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setLayouts((prev) => {
      const current = prev[key];
      if (
        current &&
        current.x === x &&
        current.y === y &&
        current.width === width &&
        current.height === height
      ) {
        return prev;
      }
      return { ...prev, [key]: { x, y, width, height } };
    });
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const all = layouts.all;
    const review = layouts.review;
    if (!all || !review) return { opacity: 0 };
    return {
      opacity: 1,
      width: interpolate(progress.value, [0, 1], [all.width, review.width]),
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [all.x, review.x]),
        },
      ],
    };
  }, [layouts]);

  const blueLayerStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));
  const amberLayerStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const track = layouts.all ?? layouts.review;

  return (
    <View style={styles.segments} accessibilityRole="tablist">
      <View style={styles.segmentTrack}>
        {track && (
          <Animated.View
            style={[
              styles.indicator,
              { top: track.y, height: track.height },
              indicatorStyle,
            ]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Animated.View style={[StyleSheet.absoluteFill, blueLayerStyle]}>
              <LinearGradient
                colors={ACCENT_GRADIENT}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 1, y: 0.9 }}
                locations={[0, 0.7071]}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFill, amberLayerStyle]}>
              <LinearGradient
                colors={[theme.colors.reviewFrom, theme.colors.reviewTo]}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 1, y: 0.9 }}
                locations={[0, 0.7071]}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </Animated.View>
        )}

        <Pressable
          accessibilityRole="tab"
          accessibilityLabel={t('tasks.allTasks')}
          accessibilityState={{ selected: allActive }}
          onPress={() => onTabChange('all')}
          onLayout={measure('all')}
          style={[styles.segment, compact && styles.segmentCompact]}
        >
          <SegmentLabel
            label={t('tasks.allTasks')}
            compact={compact}
            progress={progress}
            direction="all"
            activeColor={theme.colors.white}
          />
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          accessibilityLabel={t('tasks.reviewTasks')}
          accessibilityState={{ selected: reviewActive }}
          onPress={() => onTabChange('review')}
          onLayout={measure('review')}
          style={[
            styles.segment,
            compact && styles.segmentCompact,
            reviewCount > 0 && styles.segmentWithBadge,
          ]}
        >
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
            progress={progress}
            direction="review"
            activeColor={theme.colors.reviewText}
          />
          {reviewCount > 0 && (
            <LinearGradient
              colors={ACCENT_GRADIENT}
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
      <LetterAvatar source={avatar} name={name} style={styles.ownerAvatar} />
      <Text style={styles.ownerName} numberOfLines={1}>
        {t('tasks.ownerTasks', { name })}
      </Text>
    </View>
  );
}

type SegmentLabelProps = {
  label: string;
  compact: boolean;
  /** 0 — выбран All, 1 — выбран Review. */
  progress: SharedValue<number>;
  direction: 'all' | 'review';
  /** Цвет выбранной подписи. */
  activeColor: string;
};

/**
 * Подпись сегмента. Выбранная подпись жирная, а жирный текст шире: без
 * распорки граница между сегментами сдвигалась бы при каждом переключении.
 * Ширину всегда задаёт невидимая жирная копия; видимые слои лежат поверх.
 * Обычная серая подпись и жирная цветная перетекают друг в друга
 * прозрачностью: цвет текста не меняется покадрово, поэтому текст не
 * перерисовывается на каждом кадре анимации.
 */
function SegmentLabel({
  label,
  compact,
  progress,
  direction,
  activeColor,
}: SegmentLabelProps) {
  const base = [styles.segmentLabel, compact && styles.segmentLabelCompact];

  // 0 — сегмент не выбран, 1 — выбран.
  const idleStyle = useAnimatedStyle(
    () => ({
      opacity: direction === 'all' ? progress.value : 1 - progress.value,
    }),
    [direction],
  );

  const boldStyle = useAnimatedStyle(
    () => ({
      opacity: direction === 'all' ? 1 - progress.value : progress.value,
    }),
    [direction],
  );

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text
        aria-hidden
        style={[base, styles.segmentLabelBold, styles.segmentLabelSizer]}
      >
        {label}
      </Text>
      <Animated.Text style={[base, styles.segmentLabelOverlay, idleStyle]}>
        {label}
      </Animated.Text>
      <Animated.Text
        style={[
          base,
          styles.segmentLabelBold,
          styles.segmentLabelOverlay,
          { color: activeColor },
          boldStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </View>
  );
}

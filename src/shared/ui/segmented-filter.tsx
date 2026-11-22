import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { createStyles, theme, themedValue, tracking } from '../theme';

import { selectionTiming, useSlidingSegment } from './use-sliding-segment';

type Option<T extends string> = { value: T; label: string };

type SegmentedFilterProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Цвет выбранного: фиолетовый у родителя, голубой у ребёнка. */
  tone?: 'parent' | 'child';
};

const GRADIENTS = themedValue<
  Record<'parent' | 'child', readonly [string, string]>
>(() => ({
  parent: [theme.colors.violet, theme.colors.blue],
  child: [theme.colors.childFrom, theme.colors.childDeep],
}));

/** Белая полоса с вариантами фильтра, выбранный — на цветной плашке. */
export function SegmentedFilter<T extends string>({
  options,
  value,
  onChange,
  tone = 'parent',
}: SegmentedFilterProps<T>) {
  const { target, indicator, measure, reduceMotion } = useSlidingSegment(value);

  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {target && (
        <Animated.View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.indicator,
            { top: target.y, height: target.height },
            indicator,
          ]}
        >
          <LinearGradient
            colors={GRADIENTS[tone]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            onLayout={measure(option.value)}
            style={styles.segment}
          >
            <SegmentLabel
              label={option.label}
              selected={selected}
              reduceMotion={reduceMotion}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

function SegmentLabel({
  label,
  selected,
  reduceMotion,
}: {
  label: string;
  selected: boolean;
  reduceMotion: boolean;
}) {
  const progress = useSharedValue(selected ? 1 : 0);
  const inactive = theme.colors.ink;
  const active = theme.colors.white;

  useEffect(() => {
    const next = selected ? 1 : 0;
    progress.value = reduceMotion ? next : withTiming(next, selectionTiming);
  }, [selected, reduceMotion, progress]);

  const tint = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [inactive, active]),
  }));
  const bold = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text
        aria-hidden
        numberOfLines={1}
        style={[styles.label, styles.labelSelected, styles.sizer]}
      >
        {label}
      </Text>
      <Animated.Text
        aria-hidden
        numberOfLines={1}
        style={[styles.label, styles.textLayer, tint]}
      >
        {label}
      </Animated.Text>
      <Animated.Text
        aria-hidden
        numberOfLines={1}
        style={[
          styles.label,
          styles.labelSelected,
          styles.textLayer,
          tint,
          bold,
        ]}
      >
        {label}
      </Animated.Text>
    </View>
  );
}

const styles = createStyles((colors) => ({
  bar: {
    height: 48,
    flexDirection: 'row',
    gap: 4,
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
  },
  // Ширина — по подписи («All» узкий, «Withdrawals» шире), остаток делится
  // поровну.
  segment: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 3px 8px rgba(108, 92, 231, 0.25)',
  },
  sizer: { opacity: 0 },
  textLayer: { ...StyleSheet.absoluteFill, textAlign: 'center' },
  label: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: colors.ink,
  },
  labelSelected: {
    fontFamily: theme.fonts.semibold,
    color: colors.white,
  },
}));

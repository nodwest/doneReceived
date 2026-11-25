import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { selectionTiming } from './use-sliding-segment';
import { LinearGradient } from 'expo-linear-gradient';
import { createStyles, theme } from '../theme';

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel?: string;
  /** Нельзя переключить: бледнее, нажатия не работают. */
  disabled?: boolean;
  /** Цвет включённого: фиолетово-синий (по умолчанию) или голубой (карта). */
  tone?: 'violet' | 'blue';
};

/** Переключатель 44×26: включён — градиент (`tone`), выключен — серый. */
export function Toggle({
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
  tone = 'violet',
}: ToggleProps) {
  const blue = tone === 'blue';
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    const next = value ? 1 : 0;
    progress.value = reduceMotion ? next : withTiming(next, selectionTiming);
  }, [value, reduceMotion, progress]);

  const gradient = useAnimatedStyle(() => ({ opacity: progress.value }));
  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 18 }],
  }));
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      hitSlop={6}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={disabled && styles.disabled}
    >
      <View style={[styles.track, blue && styles.trackOffBlue]}>
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, gradient]}
        >
          <LinearGradient
            colors={
              blue
                ? [theme.colors.childFrom, theme.colors.childDeep]
                : [theme.colors.violet, theme.colors.blue]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0.37, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.knob, knob]} />
      </View>
    </Pressable>
  );
}

const styles = createStyles((colors) => ({
  disabled: {
    opacity: 0.5,
  },
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 3,
    overflow: 'hidden',
    backgroundColor: colors.placeholder,
  },
  trackOffBlue: {
    backgroundColor: colors.toggleOff,
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
}));

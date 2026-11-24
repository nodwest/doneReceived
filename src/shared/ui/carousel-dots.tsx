import type { Key } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  type SharedValue,
} from 'react-native-reanimated';
import { createStyles } from '../theme';

const DOT_SIZE = 6;
const DOT_STEP = 20;

type CarouselDotsProps = {
  keys: readonly Key[];
  progress: SharedValue<number>;
  color: string;
};

export function CarouselDots({ keys, progress, color }: CarouselDotsProps) {
  const reduceMotion = useReducedMotion();
  const indicator = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          DOT_STEP *
          (reduceMotion ? Math.round(progress.get()) : progress.get()),
      },
    ],
  }));

  if (keys.length < 2) return null;
  return (
    <View style={styles.dots}>
      {keys.map((key) => (
        <View key={key} style={styles.dotSlot}>
          <View style={styles.dot} />
        </View>
      ))}
      <Animated.View
        style={[styles.dotActive, { backgroundColor: color }, indicator]}
      />
    </View>
  );
}

const styles = createStyles((colors) => ({
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 13,
  },
  dotSlot: {
    width: DOT_STEP,
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.placeholder,
  },
  dotActive: {
    position: 'absolute',
    left: 0,
    width: DOT_STEP,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
}));

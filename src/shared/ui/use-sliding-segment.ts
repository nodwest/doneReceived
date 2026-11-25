import { useEffect, useRef, useState } from 'react';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const selectionTiming = {
  duration: 240,
  easing: Easing.out(Easing.cubic),
};

export function useSlidingSegment<T extends string>(value: T) {
  const reduceMotion = useReducedMotion();
  const [layouts, setLayouts] = useState<Partial<Record<T, LayoutRectangle>>>(
    {},
  );
  const target = layouts[value];
  const positioned = useRef(false);
  const x = useSharedValue(0);
  const width = useSharedValue(0);

  useEffect(() => {
    if (!target) return;
    if (!positioned.current || reduceMotion) {
      x.value = target.x;
      width.value = target.width;
    } else {
      x.value = withTiming(target.x, selectionTiming);
      width.value = withTiming(target.width, selectionTiming);
    }
    positioned.current = true;
  }, [target, reduceMotion, x, width]);

  const indicator = useAnimatedStyle(() => ({
    width: width.value,
    transform: [{ translateX: x.value }],
  }));

  const measure =
    (key: T) =>
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setLayouts((previous) => {
        const current = previous[key];
        if (
          current?.x === layout.x &&
          current.y === layout.y &&
          current.width === layout.width &&
          current.height === layout.height
        )
          return previous;
        return { ...previous, [key]: layout };
      });
    };

  return { target, indicator, measure, reduceMotion };
}

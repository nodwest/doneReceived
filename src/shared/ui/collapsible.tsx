import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const DURATION_MS = 220;
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

type CollapsibleProps = {
  open: boolean;
  children: ReactNode;
};

/**
 * Плавно раскрывает содержимое по высоте и сворачивает обратно. Свёрнутое
 * содержимое не рисуется: его не видят ни скринридер, ни клавиатура.
 * Отступ над содержимым держите внутри него, иначе он останется и после
 * сворачивания.
 */
export function Collapsible({ open, children }: CollapsibleProps) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  const height = useSharedValue(0);
  const progress = useSharedValue(open ? 1 : 0);

  useEffect(() => {
    progress.set(
      withTiming(open ? 1 : 0, {
        duration: DURATION_MS,
        easing: EASE_OUT,
        reduceMotion: ReduceMotion.System,
      }),
    );
    if (open) return;
    // Убирает содержимое таймер, а не конец анимации: так оно исчезнет, даже
    // если анимация не доиграет.
    const timer = setTimeout(() => setMounted(false), DURATION_MS);
    return () => clearTimeout(timer);
  }, [open, progress]);

  const style = useAnimatedStyle(() => ({
    height: height.get() * progress.get(),
    opacity: progress.get(),
  }));

  if (!mounted) return null;
  return (
    <Animated.View
      style={[styles.clip, style]}
      accessibilityElementsHidden={!open}
      importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
    >
      <View
        style={styles.content}
        onLayout={(event) => height.set(event.nativeEvent.layout.height)}
      >
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  // Полная высота не зависит от того, насколько раскрыта обёртка.
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type PanResponderCallbacks,
} from 'react-native';

// С какого сдвига по горизонтали жест считается свайпом, а не прокруткой.
const SWIPE_SLOP = 8;
// Быстрый смах открывает или закрывает действия, даже если сдвиг короткий.
const FLING_VELOCITY = 0.5;
const ANIMATION_MS = 180;

type SwipeableRowProps = {
  /** Действия открыты: строка сдвинута влево. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Кнопки под строкой у правого края (Edit, Delete). */
  actions: ReactNode;
  /** На сколько сдвигается строка, открывая действия. */
  actionsWidth: number;
  children: ReactNode;
};

/**
 * Строка, которую смахивают влево: из-под неё выезжают действия. Тап по
 * открытой строке закрывает её. Открытостью управляет родитель — так
 * открытой остаётся только одна строка списка.
 */
export function SwipeableRow({
  open,
  onOpenChange,
  actions,
  actionsWidth,
  children,
}: SwipeableRowProps) {
  const [offset] = useState(() => new Animated.Value(0));
  // Действия отрисованы, только пока строку смахивают или она открыта:
  // спрятанные кнопки не нажимаются и не попадают в доступность.
  const [revealed, setRevealed] = useState(open);
  if (open && !revealed) setRevealed(true);
  // Свежие пропсы для обработчиков жеста, которые создаются один раз.
  const latest = useRef({ open, onOpenChange, actionsWidth });
  useLayoutEffect(() => {
    latest.current = { open, onOpenChange, actionsWidth };
  });
  // Где была строка, когда палец её взял.
  const startX = useRef(0);

  const animateTo = (toOpen: boolean) =>
    Animated.timing(offset, {
      toValue: toOpen ? -latest.current.actionsWidth : 0,
      duration: ANIMATION_MS,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !toOpen) setRevealed(false);
    });

  useEffect(() => {
    Animated.timing(offset, {
      toValue: open ? -actionsWidth : 0,
      duration: ANIMATION_MS,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !open) setRevealed(false);
    });
  }, [open, actionsWidth, offset]);

  const [handlers] = useState<PanResponderCallbacks>(() => ({
    // Тап по открытой строке перехватываем, чтобы закрыть её, а не нажать.
    onStartShouldSetPanResponderCapture: () => latest.current.open,
    onMoveShouldSetPanResponder: (_, { dx, dy }) =>
      Math.abs(dx) > SWIPE_SLOP && Math.abs(dx) > Math.abs(dy) * 1.5,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => {
      setRevealed(true);
      offset.stopAnimation((value) => {
        startX.current = value;
      });
    },
    onPanResponderMove: (_, { dx }) => {
      const width = latest.current.actionsWidth;
      offset.setValue(Math.min(Math.max(startX.current + dx, -width), 0));
    },
    onPanResponderRelease: (_, { dx, vx }) => {
      const { open: wasOpen, actionsWidth: width } = latest.current;
      const moved = Math.abs(dx) > SWIPE_SLOP;
      let next =
        moved && (startX.current + dx < -width / 2 || vx < -FLING_VELOCITY);
      if (vx > FLING_VELOCITY) next = false;
      animateTo(next);
      if (next !== wasOpen) latest.current.onOpenChange(next);
    },
    onPanResponderTerminate: () => animateTo(latest.current.open),
  }));
  const [responder] = useState(() => PanResponder.create(handlers));

  // Действия видны, только пока строка сдвинута: иначе их край выглядывал бы
  // из-под скруглённых углов строки.
  const actionsOpacity = offset.interpolate({
    inputRange: [-24, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View>
      {revealed && (
        <Animated.View
          style={[
            styles.actions,
            { width: actionsWidth, opacity: actionsOpacity },
          ]}
        >
          {actions}
        </Animated.View>
      )}
      <Animated.View
        {...responder.panHandlers}
        style={{ transform: [{ translateX: offset }] }}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

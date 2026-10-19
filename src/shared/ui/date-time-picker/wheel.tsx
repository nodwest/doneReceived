import { useEffect, useRef } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { styles, WHEEL_ITEM_HEIGHT } from './date-time-picker.styled';

export type WheelItem = { label: string; value: number; disabled?: boolean };

type WheelProps = {
  items: WheelItem[];
  value: number;
  onChange: (value: number) => void;
  /** Нечётное число видимых строк; выбранная — по центру. */
  visibleRows: number;
  width: number;
};

const SETTLE_DELAY_WEB = 150;
const MIN_FLING_VELOCITY = 0.05;

/** Барабан с «примагничиванием»; недоступные значения серые и не выбираются. */
export function Wheel({
  items,
  value,
  onChange,
  visibleRows,
  width,
}: WheelProps) {
  const edgePadding = (WHEEL_ITEM_HEIGHT * (visibleRows - 1)) / 2;
  const scrollRef = useRef<ScrollView>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const index = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );
  // Индекс, на котором барабан уже стоит; чтобы не дёргать скролл лишний раз.
  const settledIndex = useRef(index);

  const scrollToIndex = (target: number, animated: boolean) =>
    scrollRef.current?.scrollTo({ y: target * WHEEL_ITEM_HEIGHT, animated });

  useEffect(() => {
    if (settledIndex.current === index) return;
    settledIndex.current = index;
    scrollRef.current?.scrollTo({
      y: index * WHEEL_ITEM_HEIGHT,
      animated: true,
    });
  }, [index]);

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  const nearestEnabled = (from: number) => {
    for (let step = 0; step < items.length; step++) {
      for (const candidate of [from - step, from + step]) {
        if (items[candidate] && !items[candidate].disabled) return candidate;
      }
    }
    return -1;
  };

  const settle = (offsetY: number) => {
    const raw = Math.round(offsetY / WHEEL_ITEM_HEIGHT);
    const picked = Math.min(Math.max(raw, 0), items.length - 1);
    const target = nearestEnabled(picked);
    if (target === -1) return;

    settledIndex.current = target;
    if (target !== raw) scrollToIndex(target, true);
    onChange(items[target].value);
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) =>
    settle(event.nativeEvent.contentOffset.y);

  // Палец отпущен без инерции — onMomentumScrollEnd не придёт. Если инерция
  // есть, ждём её конца, чтобы не прерывать прокрутку на недоступном значении.
  const onDragEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Math.abs(event.nativeEvent.velocity?.y ?? 0) < MIN_FLING_VELOCITY) {
      onScrollEnd(event);
    }
  };

  // В вебе нет событий окончания инерции: считаем, что скролл закончен после паузы.
  const onScroll =
    Platform.OS === 'web'
      ? (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          clearTimeout(settleTimer.current);
          settleTimer.current = setTimeout(
            () => settle(offsetY),
            SETTLE_DELAY_WEB,
          );
        }
      : undefined;

  return (
    <View style={{ width, height: WHEEL_ITEM_HEIGHT * visibleRows }}>
      <View
        style={[styles.wheelBand, { top: edgePadding, pointerEvents: 'none' }]}
      />
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={WHEEL_ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: edgePadding }}
        onLayout={() => scrollToIndex(index, false)}
        onScroll={onScroll}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onDragEnd}
      >
        {items.map((item) => (
          <View key={item.value} style={styles.wheelItem}>
            <Text
              style={[
                styles.wheelText,
                item.value === value && styles.wheelTextSelected,
                item.disabled && styles.wheelTextDisabled,
              ]}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

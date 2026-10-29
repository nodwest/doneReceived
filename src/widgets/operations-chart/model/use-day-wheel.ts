import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Platform,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
} from 'react-native';
import { DAY_SLOT_WIDTH } from '../config/sizes';

const SETTLE_DELAY_WEB = 120;
// Запас на плавную прокрутку после тапа: если лента так и не доехала до дня
// (например, тап по уже выбранному), выбор снова следует за прокруткой.
const TAP_SCROLL_TIMEOUT = 800;

type DayWheelOptions = {
  count: number;
  /** Выбранный день — тот, что стоит по центру. */
  index: number;
  onIndexChange: (index: number) => void;
};

/**
 * Горизонтальный барабан дней: выбранный день всегда по центру, лента
 * примагничивается к дню, выбор меняется прямо во время прокрутки.
 */
export function useDayWheel({ count, index, onIndexChange }: DayWheelOptions) {
  const scrollRef = useRef<ScrollView>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // День, к которому лента едет после тапа: пока она в пути, промежуточные
  // позиции выбор не меняют — иначе он метался бы между старым и новым днём.
  const tapTarget = useRef<number | null>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [width, setWidth] = useState(0);
  // Лента уже прокручена к стартовому дню.
  const positioned = useRef(false);

  // Отступы по краям, чтобы первый и последний день тоже вставали по центру.
  const sidePadding = Math.max((width - DAY_SLOT_WIDTH) / 2, 0);

  useEffect(
    () => () => {
      clearTimeout(settleTimer.current);
      clearTimeout(tapTimer.current);
    },
    [],
  );

  const releaseTap = () => {
    tapTarget.current = null;
    clearTimeout(tapTimer.current);
  };

  const clamp = (value: number) => Math.min(Math.max(value, 0), count - 1);

  const scrollToIndex = (target: number, animated: boolean) =>
    scrollRef.current?.scrollTo({ x: target * DAY_SLOT_WIDTH, animated });

  const onLayout = (event: LayoutChangeEvent) =>
    setWidth(event.nativeEvent.layout.width);

  // Стартовая прокрутка сразу после того, как ширина измерена и отступы по
  // краям легли в разметку: раньше scrollTo упёрся бы в край ленты. Эффект
  // срабатывает до отрисовки кадра, поэтому ленту в нулевой позиции не видно.
  // onContentSizeChange для этого не годится: в вебе он не приходит повторно,
  // когда лента расширяется за счёт отступов.
  useLayoutEffect(() => {
    if (positioned.current || width === 0 || count === 0) return;
    positioned.current = true;
    scrollRef.current?.scrollTo({ x: index * DAY_SLOT_WIDTH, animated: false });
  }, [width, count, index]);

  const settle = (offsetX: number) =>
    scrollToIndex(clamp(Math.round(offsetX / DAY_SLOT_WIDTH)), true);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // До стартовой прокрутки события говорят о нулевой позиции: пропускаем.
    if (!positioned.current) return;
    const offsetX = event.nativeEvent.contentOffset.x;
    const next = clamp(Math.round(offsetX / DAY_SLOT_WIDTH));
    if (tapTarget.current !== null) {
      // Лента доехала до дня из тапа — дальше выбор снова следует за ней.
      if (next === tapTarget.current) releaseTap();
    } else if (next !== index) {
      onIndexChange(next);
    }
    // В вебе нет примагничивания и событий окончания инерции: доводим после паузы.
    if (Platform.OS === 'web') {
      clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(() => settle(offsetX), SETTLE_DELAY_WEB);
    }
  };

  /** Тап по дню: он сразу выбран, лента плавно доезжает до него. */
  const select = (target: number) => {
    if (target !== index) {
      tapTarget.current = target;
      clearTimeout(tapTimer.current);
      tapTimer.current = setTimeout(releaseTap, TAP_SCROLL_TIMEOUT);
    }
    scrollToIndex(target, true);
    onIndexChange(target);
  };

  return {
    scrollRef,
    sidePadding,
    // Пока ширина не измерена, раскладка ленты неверная: не показываем её.
    ready: width > 0,
    onLayout,
    onScroll,
    // Пользователь сам взялся за ленту — выбор снова следует за прокруткой.
    onScrollBeginDrag: releaseTap,
    select,
  };
}

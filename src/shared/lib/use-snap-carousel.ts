import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Platform,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
} from 'react-native';

// Доля шага, после которой свайп считается переходом к соседней карточке.
const SWIPE_THRESHOLD = 0.15;
const SETTLE_DELAY_WEB = 120;
const MIN_FLING_VELOCITY = 0.05;

type SnapCarouselOptions = {
  count: number;
  /** Боковой отступ страницы, за который выходит лента. */
  gutter: number;
  /** Какая часть следующей карточки выглядывает у правого края. */
  peek: number;
  gap: number;
  /** Карточка, на которой лента стоит после монтирования и после смены набора. */
  initialIndex?: number;
  /**
   * Признак набора карточек (например, сам массив). Когда он меняется, лента
   * не пересоздаётся, а мгновенно встаёт на initialIndex: ширина уже измерена,
   * поэтому кадра с неверной раскладкой нет.
   */
  resetKey?: unknown;
  onIndexChange?: (index: number) => void;
};

/**
 * Горизонтальная лента карточек, которая примагничивается к карточке после
 * свайпа. Возвращает ширину карточки, текущую страницу и обработчики для
 * ScrollView.
 */
export function useSnapCarousel({
  count,
  gutter,
  peek,
  gap,
  initialIndex = 0,
  resetKey,
  onIndexChange,
}: SnapCarouselOptions) {
  const scrollRef = useRef<ScrollView>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Страница, на которой лента остановилась в последний раз.
  const settledPage = useRef(initialIndex);
  const reportedIndex = useRef(initialIndex);
  // Карточка, к которой нужно прокрутить, как только лента станет достаточно широкой.
  const pendingIndex = useRef<number | null>(
    initialIndex > 0 ? initialIndex : null,
  );
  const appliedKey = useRef(resetKey);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(initialIndex);
  // Лента стоит на стартовой карточке: до этого её не показываем.
  const [positioned, setPositioned] = useState(initialIndex === 0);

  // Новый набор карточек: точки сразу показывают стартовую страницу.
  const [prevKey, setPrevKey] = useState(resetKey);
  if (resetKey !== prevKey) {
    setPrevKey(resetKey);
    setIndex(initialIndex);
  }

  const single = count < 2;
  // Одна карточка занимает всю ширину между отступами: соседней нет. Ширина
  // всегда явная — '100%' внутри горизонтальной ленты считался бы от её
  // содержимого, и карточка с длинным текстом вылезала бы за экран.
  const cardWidth = Math.max(
    single ? width - 2 * gutter : width - gutter - peek - gap,
    0,
  );
  const interval = cardWidth + gap;
  // Запас справа, чтобы последняя карточка тоже вставала к левому отступу.
  const trackPaddingRight = Math.max(width - cardWidth - gutter, gutter);
  // Пока ширина не измерена или лента не на месте, кадр был бы неверным.
  const ready = cardWidth > 0 && positioned;

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  // Смена набора: ставим ленту на место до отрисовки кадра, без анимации.
  useLayoutEffect(() => {
    if (appliedKey.current === resetKey) return;
    appliedKey.current = resetKey;
    clearTimeout(settleTimer.current);
    settledPage.current = initialIndex;
    reportedIndex.current = initialIndex;
    // Нативная лента могла ещё не вырасти под новые карточки: повторим в onContentSizeChange.
    pendingIndex.current = initialIndex > 0 ? initialIndex : null;
    if (cardWidth > 0) {
      scrollRef.current?.scrollTo({
        x: initialIndex * interval,
        animated: false,
      });
    }
  }, [resetKey, initialIndex, interval, cardWidth]);

  // Прокрутка к стартовой карточке, когда лента уже достаточно широкая,
  // иначе scrollTo упрётся в край и останется на нуле.
  const onContentSizeChange = (contentWidth: number) => {
    const target = pendingIndex.current;
    if (target === null || cardWidth <= 0) return;
    const x = target * interval;
    if (contentWidth < x + width) return;
    pendingIndex.current = null;
    scrollRef.current?.scrollTo({ x, animated: false });
    setPositioned(true);
  };

  const changeIndex = (page: number) => {
    setIndex(page);
    if (page !== reportedIndex.current) {
      reportedIndex.current = page;
      onIndexChange?.(page);
    }
  };

  const clampPage = (page: number) => Math.min(Math.max(page, 0), count - 1);

  const settle = (offsetX: number) => {
    if (cardWidth <= 0) return;
    const shift = offsetX - settledPage.current * interval;
    // Дальше шага — просто ближайшая карточка, иначе малый свайп листает на одну.
    const raw =
      Math.abs(shift) >= interval
        ? Math.round(offsetX / interval)
        : settledPage.current +
          (Math.abs(shift) > interval * SWIPE_THRESHOLD ? Math.sign(shift) : 0);
    const page = clampPage(raw);

    // Лента уже стоит, где нужно: отложенная стартовая прокрутка больше не нужна.
    pendingIndex.current = null;
    settledPage.current = page;
    changeIndex(page);
    scrollRef.current?.scrollTo({ x: page * interval, animated: true });
  };

  const onLayout = (event: LayoutChangeEvent) =>
    setWidth(event.nativeEvent.layout.width);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // До стартовой прокрутки события скролла говорят о нулевой позиции: пропускаем.
    if (!positioned || cardWidth <= 0) return;
    const offsetX = event.nativeEvent.contentOffset.x;
    changeIndex(clampPage(Math.round(offsetX / interval)));
    // В вебе нет событий окончания инерции: считаем, что скролл закончен после паузы.
    if (Platform.OS === 'web') {
      clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(() => settle(offsetX), SETTLE_DELAY_WEB);
    }
  };

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => settle(event.nativeEvent.contentOffset.x);

  // Палец отпущен без инерции: onMomentumScrollEnd не придёт, доводим сразу.
  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Math.abs(event.nativeEvent.velocity?.x ?? 0) < MIN_FLING_VELOCITY) {
      settle(event.nativeEvent.contentOffset.x);
    }
  };

  return {
    scrollRef,
    index,
    cardWidth,
    single,
    ready,
    trackPaddingRight,
    onLayout,
    onContentSizeChange,
    onScroll,
    onMomentumScrollEnd,
    onScrollEndDrag,
  };
}

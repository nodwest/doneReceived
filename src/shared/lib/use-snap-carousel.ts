import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  type LayoutChangeEvent,
  type ScrollView,
} from 'react-native';

// Доля шага, после которой свайп считается переходом к соседней карточке.
const SWIPE_THRESHOLD = 0.15;
const SETTLE_DELAY_WEB = 120;
const IS_WEB = Platform.OS === 'web';

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
  const scrollProgress = useSharedValue(initialIndex);
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
  // Без подглядывания (peek 0) карточка тоже во всю ширину, а соседняя
  // начинается за краем экрана.
  const cardWidth = Math.max(
    single || peek === 0 ? width - 2 * gutter : width - gutter - peek - gap,
    0,
  );
  const interval = cardWidth + gap;
  // Запас справа, чтобы последняя карточка тоже вставала к левому отступу.
  const trackPaddingRight = Math.max(width - cardWidth - gutter, gutter);
  const ready = cardWidth > 0;

  const snapToOffsets = useMemo(
    () =>
      !IS_WEB && ready && !single
        ? Array.from({ length: count }, (_, page) => page * interval)
        : undefined,
    [count, interval, ready, single],
  );

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  // Смена набора: ставим ленту на место до отрисовки кадра, без анимации.
  useLayoutEffect(() => {
    if (appliedKey.current === resetKey) return;
    appliedKey.current = resetKey;
    clearTimeout(settleTimer.current);
    scrollProgress.set(initialIndex);
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
  }, [resetKey, initialIndex, interval, cardWidth, scrollProgress]);

  // Прокрутка к стартовой карточке, когда лента уже достаточно широкая,
  // иначе scrollTo упрётся в край и останется на нуле.
  const onContentSizeChange = (contentWidth: number) => {
    const target = pendingIndex.current;
    if (target === null || cardWidth <= 0) return;
    const x = target * interval;
    if (contentWidth < x + gutter + cardWidth - 1) return;
    pendingIndex.current = null;
    scrollProgress.set(target);
    scrollRef.current?.scrollTo({ x, animated: false });
  };

  const changeIndex = (page: number) => {
    if (page !== reportedIndex.current) {
      setIndex(page);
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
    const start = settledPage.current;
    const page = clampPage(Math.min(start + 1, Math.max(start - 1, raw)));

    // Лента уже стоит, где нужно: отложенная стартовая прокрутка больше не нужна.
    pendingIndex.current = null;
    settledPage.current = page;
    changeIndex(page);
    if (Math.abs(offsetX - page * interval) > 0.5) {
      scrollRef.current?.scrollTo({ x: page * interval, animated: true });
    }
  };

  // Ставит ленту на карточку, где она остановилась, без анимации.
  const realign = () => {
    if (pendingIndex.current !== null || cardWidth <= 0) return;
    scrollRef.current?.scrollTo({
      x: settledPage.current * interval,
      animated: false,
    });
  };

  // Ширина изменилась (поворот, окно браузера): шаг другой, встаём на ту же карточку.
  useLayoutEffect(() => {
    if (pendingIndex.current !== null || interval <= gap) return;
    scrollRef.current?.scrollTo({
      x: settledPage.current * interval,
      animated: false,
    });
  }, [interval, gap]);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    // Нулевая ширина — экран ушёл вглубь стека (в вебе он display: none). Если её
    // принять, карточки сожмутся, браузер обрежет прокрутку, и после «назад»
    // лента встанет на соседнюю карточку. Оставляем прежнюю ширину.
    if (next === 0) return;
    // Экран снова виден: браузер мог сбросить прокрутку скрытой ленты.
    if (next !== width) setWidth(next);
    else if (IS_WEB) realign();
  };

  const onWebScroll = (offsetX: number) => {
    if (pendingIndex.current !== null) return;
    changeIndex(clampPage(Math.round(offsetX / interval)));
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => settle(offsetX), SETTLE_DELAY_WEB);
  };

  const onNativePageChange = (page: number) => {
    if (pendingIndex.current !== null) return;
    settledPage.current = page;
    changeIndex(page);
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (!ready || single) return;
      const offsetX = event.contentOffset.x;
      const page = Math.min(Math.max(offsetX / interval, 0), count - 1);
      const previous = scrollProgress.get();
      scrollProgress.set(page);
      if (IS_WEB) {
        scheduleOnRN(onWebScroll, offsetX);
      } else if (Math.round(previous) !== Math.round(page)) {
        scheduleOnRN(onNativePageChange, Math.round(page));
      }
    },
  });

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
    scrollProgress,
    snapToOffsets,
  };
}

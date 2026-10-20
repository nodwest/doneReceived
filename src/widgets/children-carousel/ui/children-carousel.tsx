import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { ChildCard, type ChildOverview } from '@entities/user';
import {
  CAROUSEL_GAP,
  CAROUSEL_GUTTER,
  CAROUSEL_PEEK,
  styles,
} from './children-carousel.styled';

// Доля шага, после которой свайп считается переходом к соседней карточке.
const SWIPE_THRESHOLD = 0.15;
const SETTLE_DELAY_WEB = 120;
const MIN_FLING_VELOCITY = 0.05;

type ChildrenCarouselProps = {
  items: readonly ChildOverview[];
};

/**
 * Карточки детей, которые листаются вправо и влево. Следующая карточка
 * выглядывает у правого края и примагничивается после свайпа, под лентой
 * точки показывают текущую страницу.
 */
export function ChildrenCarousel({ items }: ChildrenCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Страница, на которой лента остановилась в последний раз.
  const settledPage = useRef(0);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);

  const cardWidth = Math.max(
    width - CAROUSEL_GUTTER - CAROUSEL_PEEK - CAROUSEL_GAP,
    0,
  );
  const interval = cardWidth + CAROUSEL_GAP;
  const single = items.length < 2;

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  const settle = (offsetX: number) => {
    if (interval <= 0) return;
    const shift = offsetX - settledPage.current * interval;
    // Дальше шага — просто ближайшая карточка, иначе малый свайп листает на одну.
    const raw =
      Math.abs(shift) >= interval
        ? Math.round(offsetX / interval)
        : settledPage.current +
          (Math.abs(shift) > interval * SWIPE_THRESHOLD ? Math.sign(shift) : 0);
    const page = Math.min(Math.max(raw, 0), items.length - 1);

    settledPage.current = page;
    setIndex(page);
    scrollRef.current?.scrollTo({ x: page * interval, animated: true });
  };

  const onLayout = (event: LayoutChangeEvent) =>
    setWidth(event.nativeEvent.layout.width);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    if (interval > 0) {
      const page = Math.round(offsetX / interval);
      setIndex(Math.min(Math.max(page, 0), items.length - 1));
    }
    // В вебе нет событий окончания инерции: считаем, что скролл закончен после паузы.
    if (Platform.OS === 'web') {
      clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(() => settle(offsetX), SETTLE_DELAY_WEB);
    }
  };

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) =>
    settle(event.nativeEvent.contentOffset.x);

  // Палец отпущен без инерции: onMomentumScrollEnd не придёт, доводим сразу.
  const onDragEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Math.abs(event.nativeEvent.velocity?.x ?? 0) < MIN_FLING_VELOCITY) {
      settle(event.nativeEvent.contentOffset.x);
    }
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        onLayout={onLayout}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumEnd}
        onScrollEndDrag={onDragEnd}
        scrollEventThrottle={16}
        scrollEnabled={!single}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        style={styles.scroll}
        contentContainerStyle={[
          styles.track,
          // Запас справа, чтобы последняя карточка тоже вставала к левому отступу.
          !single && {
            paddingRight: Math.max(
              width - cardWidth - CAROUSEL_GUTTER,
              CAROUSEL_GUTTER,
            ),
          },
        ]}
      >
        {items.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            style={{ width: single ? undefined : cardWidth || undefined }}
          />
        ))}
      </ScrollView>
      {!single && (
        <View style={styles.dots}>
          {items.map((child, i) => (
            <View
              key={child.id}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

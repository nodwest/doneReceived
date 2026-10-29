import { useState, type Key, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSnapCarousel } from '../lib';
import { theme } from '../theme';

const GUTTER = 12;
const GAP = 12;
// Какая часть следующей карточки выглядывает у правого края (как в макете).
const PEEK = 16;
// Запас под тень карточки: снаружи он гасится отрицательным отступом.
const SHADOW_TOP = 12;
const SHADOW_BOTTOM = 24;
// Сколько карточек по обе стороны от текущей держим отрисованными.
const RENDER_RADIUS = 1;

type SnapCarouselProps<T> = {
  items: readonly T[];
  keyExtractor: (item: T) => Key;
  /** Карточка; style — заполнить слот ленты по высоте. */
  renderItem: (item: T, style: ViewStyle) => ReactNode;
  /** С какой карточки начать (например, после выбора в списке). */
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Цвет активной точки. */
  dotColor?: string;
};

/**
 * Карточки, которые листаются свайпом и встают к левому краю; следующая
 * выглядывает справа, под лентой точки страниц. Задания, вишлист в профиле.
 */
export function SnapCarousel<T>({
  items,
  keyExtractor,
  renderItem,
  initialIndex = 0,
  onIndexChange,
  dotColor = theme.colors.violet,
}: SnapCarouselProps<T>) {
  const {
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
  } = useSnapCarousel({
    count: items.length,
    gutter: GUTTER,
    peek: PEEK,
    gap: GAP,
    initialIndex,
    // Новый набор (смена вкладки) — та же лента, она просто встаёт на место.
    resetKey: items,
    onIndexChange,
  });
  // Самая высокая лента, какую видели: рисуются только соседние карточки, и без
  // этого лента садилась бы, когда высокая карточка уходит из отрисовки.
  const [tallest, setTallest] = useState({ items, height: 0 });
  const minHeight = tallest.items === items ? tallest.height : 0;
  const onTrackSizeChange = (contentWidth: number, contentHeight: number) => {
    onContentSizeChange(contentWidth);
    if (contentHeight > minHeight) {
      setTallest({ items, height: contentHeight });
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        onLayout={onLayout}
        onContentSizeChange={onTrackSizeChange}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={16}
        scrollEnabled={!single}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        // Первый кадр до замера ширины рисовал бы карточки не того размера.
        style={[styles.scroll, !ready && styles.hidden]}
        contentContainerStyle={[
          styles.track,
          !single && { paddingRight: trackPaddingRight },
          { minHeight },
        ]}
      >
        {items.map((item, i) => {
          const key = keyExtractor(item);
          const style: ViewStyle = { width: cardWidth || undefined };
          // Рисуем только видимую карточку и соседние: остальные — пустые места
          // той же ширины. Вход на экран и смена вкладки не ждут всех карточек.
          return Math.abs(i - index) <= RENDER_RADIUS ? (
            <View key={key} style={style}>
              {renderItem(item, styles.card)}
            </View>
          ) : (
            <View key={key} style={style} />
          );
        })}
      </ScrollView>
      {!single && (
        <View style={styles.dots}>
          {items.map((item, i) => (
            <View
              key={keyExtractor(item)}
              style={[
                styles.dot,
                i === index && [
                  styles.dotActive,
                  { backgroundColor: dotColor },
                ],
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Лента растягивается на всю свободную высоту, карточки — вслед за ней.
  root: {
    flexGrow: 1,
  },
  // Лента выходит за боковые отступы страницы, чтобы следующая карточка была видна у края.
  scroll: {
    flexGrow: 1,
    marginHorizontal: -GUTTER,
    marginTop: -SHADOW_TOP,
    marginBottom: -SHADOW_BOTTOM,
  },
  track: {
    flexGrow: 1,
    gap: GAP,
    paddingHorizontal: GUTTER,
    paddingTop: SHADOW_TOP,
    paddingBottom: SHADOW_BOTTOM,
  },
  hidden: {
    opacity: 0,
  },
  // Карточка заполняет слот ленты по высоте.
  card: {
    flexGrow: 1,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 13,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.placeholder,
  },
  dotActive: {
    width: 20,
  },
});

import { useState, type Key, type ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { CarouselDots } from './carousel-dots';
import { useSnapCarousel } from '../lib';
import { createStyles, theme } from '../theme';

const GUTTER = 12;
// Между плитками: их тени не накладываются.
const GAP = 17;
// Какая часть следующей карточки выглядывает у правого края (как в макете).
const PEEK = 16;
// Без подглядывания карточка во всю ширину: соседняя дальше края на
// расстояние не меньше отступа, иначе её кромка была бы видна.
const FULL_GAP = 16;
// Запас под тень карточки: снаружи он гасится отрицательным отступом.
const SHADOW_TOP = 12;
const SHADOW_BOTTOM = 24;
// Высота точек под лентой вместе с отступом над ними.
const DOT_SIZE = 6;
const DOTS_HEIGHT = DOT_SIZE + 13;
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
  /**
   * Сколько следующей карточки видно у правого края; 0 — карточка во всю
   * ширину, о соседних говорят только точки.
   */
  peek?: number;
  /** Боковой отступ карточки от края экрана. */
  gutter?: number;
  /**
   * Карточка ровно по высоте свободного места, а не по содержимому: то, что
   * не влезло, прокручивается внутри карточки (экраны карточек заданий).
   */
  fill?: boolean;
  /** Карточки разной высоты в вертикальной прокрутке. */
  fitCards?: boolean;
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
  peek = PEEK,
  gutter = GUTTER,
  fill,
  fitCards,
}: SnapCarouselProps<T>) {
  // Свободная высота под карточки и точки (только с fill).
  const [rootHeight, setRootHeight] = useState(0);
  const gap = peek === 0 ? Math.max(FULL_GAP, gutter) : GAP;
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
    scrollProgress,
    snapToOffsets,
  } = useSnapCarousel({
    count: items.length,
    gutter,
    peek,
    gap,
    initialIndex,
    // Новый набор (смена вкладки) — та же лента, она просто встаёт на место.
    resetKey: JSON.stringify(items.map(keyExtractor)),
    onIndexChange,
  });
  // Самая высокая лента, какую видели: рисуются только соседние карточки, и без
  // этого лента садилась бы, когда высокая карточка уходит из отрисовки.
  const [tallest, setTallest] = useState<{
    items: readonly T[];
    height: number;
  } | null>(null);
  const minHeight = tallest?.items === items ? tallest.height : 0;
  const onTrackSizeChange = (contentWidth: number, contentHeight: number) => {
    onContentSizeChange(contentWidth);
    if (!fill && !fitCards && contentHeight > minHeight) {
      setTallest({ items, height: contentHeight });
    }
  };
  const slotHeight = Math.max(
    rootHeight - (items.length < 2 ? 0 : DOTS_HEIGHT),
    0,
  );
  const measured = !fill || rootHeight > 0;
  return (
    <View
      style={fill ? styles.rootFill : !fitCards && styles.root}
      onLayout={
        fill
          ? (event) => {
              const next = event.nativeEvent.layout.height;
              // Нулевая высота — экран ушёл вглубь стека: оставляем прежнюю.
              if (next > 0) setRootHeight(next);
            }
          : undefined
      }
    >
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        onLayout={onLayout}
        onContentSizeChange={onTrackSizeChange}
        onScroll={onScroll}
        snapToOffsets={snapToOffsets}
        disableIntervalMomentum
        removeClippedSubviews={false}
        scrollEventThrottle={16}
        scrollEnabled={!single}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        // Первый кадр до замера ширины рисовал бы карточки не того размера.
        style={[
          styles.scroll,
          fitCards && styles.fitScroll,
          { marginHorizontal: -gutter },
          fill && {
            flexGrow: 0,
            height: slotHeight + SHADOW_TOP + SHADOW_BOTTOM,
          },
          !(ready && measured) && styles.hidden,
        ]}
        contentContainerStyle={[
          styles.track,
          { gap, paddingHorizontal: gutter },
          !single && { paddingRight: trackPaddingRight },
          fitCards ? styles.fitTrack : { minHeight },
        ]}
      >
        {items.map((item, i) => {
          const key = keyExtractor(item);
          const style: ViewStyle = {
            width: cardWidth,
            flexShrink: 0,
            height: fill ? slotHeight : undefined,
          };
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
      </Animated.ScrollView>
      <CarouselDots
        keys={items.map(keyExtractor)}
        progress={scrollProgress}
        color={dotColor}
      />
    </View>
  );
}

const styles = createStyles(() => ({
  // Лента растягивается на всю свободную высоту, карточки — вслед за ней.
  root: {
    flexGrow: 1,
  },
  // Высота — ровно свободное место, а не содержимое карточек.
  rootFill: {
    flex: 1,
    minHeight: 0,
  },
  // Лента выходит за боковые отступы страницы, чтобы следующая карточка была видна у края.
  scroll: {
    flexGrow: 1,
    marginTop: -SHADOW_TOP,
    marginBottom: -SHADOW_BOTTOM,
  },
  track: {
    flexGrow: 1,
    paddingTop: SHADOW_TOP,
    paddingBottom: SHADOW_BOTTOM,
  },
  fitScroll: { flexGrow: 0 },
  fitTrack: { alignItems: 'flex-start' },
  hidden: {
    opacity: 0,
  },
  // Карточка заполняет слот ленты по высоте.
  card: {
    flexGrow: 1,
  },
}));

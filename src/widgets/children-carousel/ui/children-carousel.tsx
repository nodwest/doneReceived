import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChildCard, type ChildOverview } from '@entities/user';
import { useSnapCarousel } from '@shared/lib';
import {
  CAROUSEL_GAP,
  CAROUSEL_GUTTER,
  CAROUSEL_PEEK,
  styles,
} from './children-carousel.styled';

type ChildrenCarouselProps = {
  items: readonly ChildOverview[];
  /** Тап по карточке ребёнка мимо чипов. */
  onSelect?: (child: ChildOverview) => void;
  /** Тап по чипу задач: active — все задачи ребёнка, review — на проверке. */
  onTasksPress?: (child: ChildOverview, tab: 'all' | 'review') => void;
};

/**
 * Карточки детей, которые листаются вправо и влево. Следующая карточка
 * выглядывает у правого края и примагничивается после свайпа, под лентой
 * точки показывают текущую страницу.
 */
export function ChildrenCarousel({
  items,
  onSelect,
  onTasksPress,
}: ChildrenCarouselProps) {
  const {
    scrollRef,
    index,
    cardWidth,
    single,
    ready,
    trackPaddingRight,
    onLayout,
    onScroll,
    snapToOffsets,
  } = useSnapCarousel({
    count: items.length,
    gutter: CAROUSEL_GUTTER,
    peek: CAROUSEL_PEEK,
    gap: CAROUSEL_GAP,
  });

  return (
    <View>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        onLayout={onLayout}
        onScroll={onScroll}
        snapToOffsets={snapToOffsets}
        disableIntervalMomentum
        scrollEventThrottle={16}
        scrollEnabled={!single}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        // Первый кадр до замера ширины рисовал бы карточки не того размера.
        style={[styles.scroll, !ready && styles.hidden]}
        contentContainerStyle={[
          styles.track,
          !single && { paddingRight: trackPaddingRight },
        ]}
      >
        {items.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            onPress={onSelect && (() => onSelect(child))}
            onActiveTasksPress={
              onTasksPress && (() => onTasksPress(child, 'all'))
            }
            onReviewTasksPress={
              onTasksPress && (() => onTasksPress(child, 'review'))
            }
            style={{ width: cardWidth || undefined }}
          />
        ))}
      </Animated.ScrollView>
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

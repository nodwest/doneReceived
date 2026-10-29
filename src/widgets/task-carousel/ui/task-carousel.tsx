import type { ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { TaskCard, type Task } from '@entities/task';
import { useSnapCarousel } from '@shared/lib';
import {
  CAROUSEL_GAP,
  CAROUSEL_GUTTER,
  CAROUSEL_PEEK,
  styles,
} from './task-carousel.styled';

// Сколько карточек по обе стороны от текущей держим отрисованными.
const RENDER_RADIUS = 1;

type TaskCarouselProps = {
  tasks: readonly Task[];
  /** С какой карточки начать (например, после выбора задачи в списке). */
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Своя карточка вместо TaskCard (карточки ребёнка). */
  renderTask?: (task: Task, style: ViewStyle) => ReactNode;
  /** Цвет активной точки: фиолетовый у родителя, голубой у ребёнка. */
  tone?: 'parent' | 'child';
};

/** Крупные карточки заданий, которые листаются свайпом; под лентой точки страниц. */
export function TaskCarousel({
  tasks,
  initialIndex = 0,
  onIndexChange,
  renderTask = (task, style) => <TaskCard task={task} style={style} />,
  tone = 'parent',
}: TaskCarouselProps) {
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
    count: tasks.length,
    gutter: CAROUSEL_GUTTER,
    peek: CAROUSEL_PEEK,
    gap: CAROUSEL_GAP,
    initialIndex,
    // Новый набор (смена вкладки) — та же лента, она просто встаёт на место.
    resetKey: tasks,
    onIndexChange,
  });

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        onLayout={onLayout}
        onContentSizeChange={onContentSizeChange}
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
        ]}
      >
        {tasks.map((task, i) => {
          const style: ViewStyle = {
            width: cardWidth || undefined,
          };
          // Рисуем только видимую карточку и соседние: остальные — пустые места
          // той же ширины. Вход на экран и смена вкладки не ждут всех карточек.
          return Math.abs(i - index) <= RENDER_RADIUS ? (
            <View key={task.id} style={style}>
              {renderTask(task, styles.card)}
            </View>
          ) : (
            <View key={task.id} style={style} />
          );
        })}
      </ScrollView>
      {!single && (
        <View style={styles.dots}>
          {tasks.map((task, i) => (
            <View
              key={task.id}
              style={[
                styles.dot,
                i === index && styles.dotActive,
                i === index && tone === 'child' && styles.dotActiveChild,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

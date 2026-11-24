import { useState } from 'react';
import { View } from 'react-native';
import PagerView, {
  type PagerViewOnPageScrollEvent,
} from 'react-native-pager-view';
import Animated, { useEvent, useSharedValue } from 'react-native-reanimated';
import { createStyles } from '@shared/theme';
import { CarouselDots } from '@shared/ui';
import type { TaskPagerProps } from './task-pager.types';

const AnimatedPager = Animated.createAnimatedComponent(PagerView);

export function TaskPager(props: TaskPagerProps) {
  const key = JSON.stringify(props.items.map((task) => task.id));
  return <TaskPages key={key} {...props} />;
}

function TaskPages({
  items,
  initialIndex,
  onIndexChange,
  renderItem,
  dotColor,
}: TaskPagerProps) {
  const [index, setIndex] = useState(initialIndex);
  const progress = useSharedValue(initialIndex);
  const onPageScroll = useEvent<PagerViewOnPageScrollEvent>(
    (event) => {
      'worklet';
      progress.set(event.position + event.offset);
    },
    ['onPageScroll'],
  );

  return (
    <View style={styles.root}>
      <AnimatedPager
        style={styles.pager}
        initialPage={initialIndex}
        scrollEnabled={items.length > 1}
        overScrollMode="never"
        onPageScroll={onPageScroll}
        onPageSelected={({ nativeEvent: { position } }) => {
          setIndex(position);
          onIndexChange?.(position);
        }}
      >
        {items.map((task, page) => (
          <View key={task.id} collapsable={false} style={styles.page}>
            {Math.abs(page - index) <= 1 && renderItem(task, styles.card)}
          </View>
        ))}
      </AnimatedPager>
      <CarouselDots
        keys={items.map((task) => task.id)}
        progress={progress}
        color={dotColor}
      />
    </View>
  );
}

const styles = createStyles(() => ({
  root: {
    flex: 1,
    minHeight: 0,
  },
  pager: {
    flex: 1,
    marginHorizontal: -16,
  },
  page: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
  },
}));

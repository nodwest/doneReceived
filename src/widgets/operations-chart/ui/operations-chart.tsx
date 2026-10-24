import { ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { DayTotals } from '@entities/operation';
import { DAY_SLOT_WIDTH } from '../config/sizes';
import { getBarScale } from '../model/bar-scale';
import { useDayWheel } from '../model/use-day-wheel';
import { DayColumn } from './day-column';
import { FADE_COLORS, styles } from './operations-chart.styled';

type OperationsChartProps = {
  days: DayTotals[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

/**
 * График по дням, совмещённый с календарём: лента листается барабаном,
 * выбранный день стоит по центру.
 */
export function OperationsChart({
  days,
  selectedIndex,
  onSelect,
}: OperationsChartProps) {
  const { scrollRef, sidePadding, ready, onLayout, onScroll, select } =
    useDayWheel({
      count: days.length,
      index: selectedIndex,
      onIndexChange: onSelect,
    });
  const scale = getBarScale(days);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={DAY_SLOT_WIDTH}
        decelerationRate="fast"
        scrollEventThrottle={16}
        style={!ready && styles.hidden}
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        onScroll={onScroll}
      >
        {days.map((day, index) => (
          <DayColumn
            key={day.date.getTime()}
            day={day}
            scale={scale}
            selected={index === selectedIndex}
            onPress={() => select(index)}
          />
        ))}
      </ScrollView>
      {/* Края ленты растворяются в фоне. */}
      <LinearGradient
        colors={FADE_COLORS}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fade, styles.fadeLeft]}
      />
      <LinearGradient
        colors={FADE_COLORS}
        locations={[0, 0.5, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={[styles.fade, styles.fadeRight]}
      />
    </View>
  );
}

import { ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { DayTotals } from '@entities/operation';
import { addDays } from '@shared/lib';
import { DAY_SLOT_WIDTH } from '../config/sizes';
import { getBarScale } from '../model/bar-scale';
import { useDayWheel } from '../model/use-day-wheel';
import { DayColumn, FutureDayColumn } from './day-column';
import { FADE_COLORS, styles } from './operations-chart.styled';

type OperationsChartProps = {
  days: DayTotals[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

/**
 * График по дням, совмещённый с календарём: лента листается барабаном,
 * выбранный день стоит по центру. Справа от сегодня — серые будущие дни.
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
  // Будущие дни занимают правый отступ ленты: ширина ленты та же, поэтому
  // докрутить до них нельзя — сегодня остаётся последним выбираемым днём.
  const lastDate = days.at(-1)?.date;
  const futureDates = lastDate
    ? Array.from({ length: Math.ceil(sidePadding / DAY_SLOT_WIDTH) }, (_, i) =>
        addDays(lastDate, i + 1),
      )
    : [];

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
        contentContainerStyle={{ paddingLeft: sidePadding }}
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
        <View style={[styles.future, { width: sidePadding }]}>
          {futureDates.map((date) => (
            <FutureDayColumn key={date.getTime()} date={date} />
          ))}
        </View>
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

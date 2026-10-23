import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { DayTotals } from '@entities/operation';
import {
  formatMonthDay,
  formatMonthShort,
  formatWeekdayShort,
} from '@shared/lib';
import { theme } from '@shared/theme';
import { COLUMN_WIDTH, COLUMN_WIDTH_SELECTED } from '../config/sizes';
import { Bar3D } from './bar-3d';
import { styles } from './day-column.styled';

type DayColumnProps = {
  day: DayTotals;
  /** pt на $1, общий для всех дней. */
  scale: number;
  selected: boolean;
  onPress: () => void;
};

/** Колонка барабана: столбик дня и дата под ним. */
export function DayColumn({ day, scale, selected, onPress }: DayColumnProps) {
  const width = selected ? COLUMN_WIDTH_SELECTED : COLUMN_WIDTH;
  const lines = (
    <>
      <Text style={[styles.weekday, selected && styles.weekdaySelected]}>
        {formatWeekdayShort(day.date)}
      </Text>
      <Text style={[styles.day, selected && styles.daySelected]}>
        {day.date.getDate()}
      </Text>
      <Text style={[styles.month, selected && styles.monthSelected]}>
        {formatMonthShort(day.date)}
      </Text>
    </>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={formatMonthDay(day.date)}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={styles.column}
    >
      <View style={!selected && styles.dimmed}>
        <Bar3D
          earned={day.earned}
          missed={day.missed}
          scale={scale}
          width={width}
          showLabels={selected}
        />
      </View>
      {selected ? (
        <LinearGradient
          colors={[theme.colors.violet, theme.colors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.7071]}
          style={[styles.chip, styles.chipSelected]}
        >
          {lines}
        </LinearGradient>
      ) : (
        <View style={styles.chip}>{lines}</View>
      )}
    </Pressable>
  );
}

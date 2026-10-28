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
          // День без наград (часто сегодня) — серый кубик, как у будущих дней,
          // чтобы над датой не было пустоты.
          future={day.earned + day.missed === 0}
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

/**
 * Будущий день справа от сегодня: серая дата и одинаковый серый кубик. Не
 * выбирается — нужен, чтобы лента не обрывалась пустотой и было видно, какие
 * дни впереди.
 */
export function FutureDayColumn({ date }: { date: Date }) {
  return (
    <View style={styles.column} accessibilityElementsHidden>
      <Bar3D
        earned={0}
        missed={0}
        scale={0}
        width={COLUMN_WIDTH}
        showLabels={false}
        future
      />
      <View style={[styles.chip, styles.chipFuture]}>
        <Text style={[styles.weekday, styles.textFuture]}>
          {formatWeekdayShort(date)}
        </Text>
        <Text style={[styles.day, styles.textFuture]}>{date.getDate()}</Text>
        <Text style={[styles.month, styles.textFuture]}>
          {formatMonthShort(date)}
        </Text>
      </View>
    </View>
  );
}

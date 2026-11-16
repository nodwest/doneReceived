import { Pressable, Text, View } from 'react-native';
import type { DayTotals } from '@entities/operation';
import {
  formatMonthDay,
  formatMonthShort,
  formatWeekdayShort,
} from '@shared/lib';
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
      <Text style={styles.weekday}>{formatWeekdayShort(day.date)}</Text>
      <Text style={styles.day}>{day.date.getDate()}</Text>
      <Text style={styles.month}>{formatMonthShort(day.date)}</Text>
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
      {/* Выбранная дата — белая в тёмной рамке: цвет на графике остаётся
          только у денег (заработано, упущено). */}
      <View style={[styles.chip, selected && styles.chipSelected]}>
        {lines}
      </View>
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

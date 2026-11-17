import { Pressable, Text, View } from 'react-native';
import { styles } from './calendar-event.styled';

type EventRowProps = {
  /** Короткий день недели: «ЧТ» / «TH». */
  weekday: string;
  day: number;
  title: string;
  meta: string;
  /** Необязательная плашка справа, например «Напомним». */
  tag?: string;
  onPress?: () => void;
};

/** Строка события под карточками: дата, название, время и плашка. */
export function EventRow({
  weekday,
  day,
  title,
  meta,
  tag,
  onPress,
}: EventRowProps) {
  return (
    <Pressable
      accessible
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${weekday} ${day}. ${title}. ${meta}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.eventRow,
        pressed && onPress ? styles.pressed : null,
      ]}
    >
      <View style={styles.dateBox}>
        <Text style={styles.dateWeekday}>{weekday}</Text>
        <Text style={styles.dateDay}>{day}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.rowMeta} numberOfLines={1}>
          {meta}
        </Text>
      </View>
      {tag && (
        <View style={styles.rowTag}>
          <Text style={styles.rowTagText}>{tag}</Text>
        </View>
      )}
    </Pressable>
  );
}

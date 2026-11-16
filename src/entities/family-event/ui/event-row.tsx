import { Text, View } from 'react-native';
import { styles } from './calendar-event.styled';

type EventRowProps = {
  /** Короткий день недели: «ЧТ» / «TH». */
  weekday: string;
  day: number;
  title: string;
  meta: string;
  /** Необязательная плашка справа, например «Напомним». */
  tag?: string;
};

/** Строка события под карточками: дата, название, время и плашка. */
export function EventRow({ weekday, day, title, meta, tag }: EventRowProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${weekday} ${day}. ${title}. ${meta}`}
      style={styles.eventRow}
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
    </View>
  );
}

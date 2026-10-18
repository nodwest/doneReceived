import { useMemo, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomSheet } from '../bottom-sheet';
import { clampDate, endOfDay, is24HourClock, startOfDay } from '../../lib/date';
import { theme } from '../../theme';
import { Wheel, type WheelItem } from './wheel';
import { styles } from './date-time-picker.styled';

const DAY_MS = 24 * 60 * 60 * 1000;
// Пять строк барабана помещаются в половину высоких экранов, иначе три.
const TALL_SCREEN = 800;
const DAY_WHEEL_WIDTH = 150;
const TIME_WHEEL_WIDTH = 64;

const pad = (n: number) => String(n).padStart(2, '0');

const HOURS_24: WheelItem[] = Array.from({ length: 24 }, (_, h) => ({
  label: pad(h),
  value: h,
}));
const HOURS_12: WheelItem[] = Array.from({ length: 12 }, (_, i) => ({
  label: String(i + 1),
  value: i + 1,
}));
const MINUTES: WheelItem[] = Array.from({ length: 60 }, (_, m) => ({
  label: pad(m),
  value: m,
}));
const PERIODS: WheelItem[] = [
  { label: 'AM', value: 0 },
  { label: 'PM', value: 1 },
];

type DateTimePickerSheetProps = {
  visible: boolean;
  value: Date;
  minimumDate: Date;
  maximumDate: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
};

export function DateTimePickerSheet({
  visible,
  onCancel,
  ...bodyProps
}: DateTimePickerSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onCancel}>
      <PickerBody onCancel={onCancel} {...bodyProps} />
    </BottomSheet>
  );
}

type PickerBodyProps = Omit<DateTimePickerSheetProps, 'visible'>;

function PickerBody({
  value,
  minimumDate,
  maximumDate,
  onConfirm,
  onCancel,
}: PickerBodyProps) {
  const { height } = useWindowDimensions();
  const visibleRows = height >= TALL_SCREEN ? 5 : 3;
  const [is24Hour] = useState(is24HourClock);
  const [today] = useState(() => startOfDay(new Date()));
  const [draft, setDraft] = useState(() => {
    const initial = new Date(value);
    initial.setSeconds(0, 0);
    return clampDate(initial, minimumDate, maximumDate);
  });

  const year = draft.getFullYear();
  const month = draft.getMonth();
  const hour = draft.getHours();
  const minute = draft.getMinutes();
  const period = hour >= 12 ? 1 : 0;

  const dayAt = (offset: number) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
  const at = (h: number, m: number) =>
    new Date(year, month, draft.getDate(), h, m);
  const outOfRange = (date: Date) => date < minimumDate || date > maximumDate;
  const update = (date: Date) =>
    setDraft(clampDate(date, minimumDate, maximumDate));

  const lastDayTime = endOfDay(maximumDate).getTime();
  const dayItems = useMemo(() => {
    const count = Math.round((lastDayTime - today.getTime()) / DAY_MS);
    return Array.from({ length: count + 1 }, (_, offset): WheelItem => {
      const day = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + offset,
      );
      const label =
        offset === 0
          ? 'Today'
          : offset === 1
            ? 'Tomorrow'
            : day.toLocaleDateString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
      return { label, value: offset, disabled: endOfDay(day) < minimumDate };
    });
  }, [today, lastDayTime, minimumDate]);

  const dayOffset = Math.round(
    (startOfDay(draft).getTime() - today.getTime()) / DAY_MS,
  );

  // Час недоступен, если в нём нет ни одной допустимой минуты.
  const hourDisabled = (h: number) =>
    at(h, 59) < minimumDate || at(h, 0) > maximumDate;

  const hours = (is24Hour ? HOURS_24 : HOURS_12).map((item) => ({
    ...item,
    disabled: hourDisabled(
      is24Hour ? item.value : (item.value % 12) + period * 12,
    ),
  }));
  const minutes = MINUTES.map((item) => ({
    ...item,
    disabled: outOfRange(at(hour, item.value)),
  }));
  const periods = PERIODS.map((item) => ({
    ...item,
    disabled: Array.from({ length: 12 }, (_, i) => i + item.value * 12).every(
      hourDisabled,
    ),
  }));

  const summary = draft.toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <Text style={styles.title}>Time to complete</Text>
        <Text style={styles.summary}>{summary}</Text>
      </View>

      <View style={styles.timeRow}>
        <Wheel
          items={dayItems}
          value={dayOffset}
          visibleRows={visibleRows}
          width={DAY_WHEEL_WIDTH}
          onChange={(offset) => {
            const day = dayAt(offset);
            update(
              new Date(
                day.getFullYear(),
                day.getMonth(),
                day.getDate(),
                hour,
                minute,
              ),
            );
          }}
        />
        <Wheel
          items={hours}
          value={is24Hour ? hour : hour % 12 || 12}
          visibleRows={visibleRows}
          width={TIME_WHEEL_WIDTH}
          onChange={(h) =>
            update(at(is24Hour ? h : (h % 12) + period * 12, minute))
          }
        />
        <Text style={styles.colon}>:</Text>
        <Wheel
          items={minutes}
          value={minute}
          visibleRows={visibleRows}
          width={TIME_WHEEL_WIDTH}
          onChange={(m) => update(at(hour, m))}
        />
        {!is24Hour && (
          <Wheel
            items={periods}
            value={period}
            visibleRows={visibleRows}
            width={TIME_WHEEL_WIDTH}
            onChange={(p) => update(at((hour % 12) + p * 12, minute))}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.cancel} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <LinearGradient
          colors={[theme.colors.violet, theme.colors.blue]}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 1, y: 0.8 }}
          locations={[0, 0.7071]}
          style={styles.confirmWrap}
        >
          <Pressable
            style={({ pressed }) => [
              styles.confirm,
              pressed && styles.confirmPressed,
            ]}
            onPress={() => onConfirm(draft)}
          >
            <Text style={styles.confirmText}>Done</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}

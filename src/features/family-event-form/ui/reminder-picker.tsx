import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { createStyles } from '@shared/theme';
import { BottomSheet, Wheel } from '@shared/ui';

const UNITS = [
  { value: 60, max: 24, key: 'reminderHours' },
  { value: 1440, max: 30, key: 'reminderDays' },
  { value: 10080, max: 2, key: 'reminderWeeks' },
] as const;

const clockItems = (size: number) =>
  Array.from({ length: size }, (_, value) => ({
    value,
    label: String(value).padStart(2, '0'),
  }));

const HOURS = clockItems(24);
const MINUTES = clockItems(60);

type ReminderPickerProps = {
  minutes: number | null;
  hourly: boolean;
  fixedDays?: number;
  time: number;
  timezone: string;
  onClear?: () => void;
  onClose: () => void;
  onConfirm: (minutes: number, hourly: boolean, time: number) => void;
};

export function ReminderPicker({
  minutes,
  hourly,
  fixedDays,
  time,
  timezone,
  onClear,
  onClose,
  onConfirm,
}: ReminderPickerProps) {
  const { t } = useTranslation();
  const [unitIndex, setUnitIndex] = useState(() =>
    hourly
      ? 0
      : UNITS.reduce(
          (selected, { value, max }, index) =>
            minutes !== null && minutes % value === 0 && minutes / value <= max
              ? index
              : selected,
          0,
        ),
  );
  const unit = UNITS[unitIndex];
  const showPeriod = fixedDays === undefined;
  const isHourly = showPeriod && unitIndex === 0;
  const [hour, setHour] = useState(Math.floor(time / 60));
  const [minute, setMinute] = useState(time % 60);
  const [count, setCount] = useState(() =>
    Math.max(
      1,
      Math.min(unit.max, Math.round((minutes ?? unit.value) / unit.value)),
    ),
  );
  const numbers = Array.from({ length: unit.max }, (_, index) => ({
    label: String(index + 1),
    value: index + 1,
  }));
  const units = UNITS.map(({ key }, index) => ({
    value: index,
    label: t(`calendar.${key}`),
  }));

  return (
    <BottomSheet visible onClose={onClose}>
      <View style={styles.body}>
        <Text style={styles.title}>
          {showPeriod
            ? t('calendar.reminderCustom')
            : t('calendar.reminderClock')}
        </Text>
        {showPeriod && (
          <View style={styles.wheels}>
            <Wheel
              key={unitIndex}
              items={numbers}
              value={count}
              onChange={setCount}
              visibleRows={3}
              width={72}
            />
            <Wheel
              items={units}
              value={unitIndex}
              onChange={(value) => {
                setUnitIndex(value);
                setCount((current) => Math.min(current, UNITS[value].max));
              }}
              visibleRows={3}
              width={140}
            />
          </View>
        )}
        {!isHourly && (
          <>
            <Text style={styles.label}>
              {t('calendar.reminderClockZone', { timezone })}
            </Text>
            <View style={styles.wheels}>
              <View>
                <Text style={styles.label}>
                  {t('calendar.reminderClockHour')}
                </Text>
                <Wheel
                  items={HOURS}
                  value={hour}
                  onChange={setHour}
                  visibleRows={3}
                  width={64}
                />
              </View>
              <View>
                <Text style={styles.label}>
                  {t('calendar.reminderClockMinute')}
                </Text>
                <Wheel
                  items={MINUTES}
                  value={minute}
                  onChange={setMinute}
                  visibleRows={3}
                  width={64}
                />
              </View>
            </View>
          </>
        )}
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={onClose}>
            <Text style={styles.action}>{t('common.cancel')}</Text>
          </Pressable>
          {onClear && (
            <Pressable accessibilityRole="button" onPress={onClear}>
              <Text style={styles.action}>{t('calendar.reminderClear')}</Text>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              onConfirm(
                fixedDays === undefined ? count * unit.value : fixedDays * 1440,
                isHourly,
                hour * 60 + minute,
              )
            }
          >
            <Text style={styles.action}>{t('common.done')}</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = createStyles((colors) => ({
  body: { gap: 16, padding: 20 },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink },
  label: { color: colors.ink, textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  action: { color: colors.childInk, padding: 12, fontWeight: '600' },
  wheels: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
}));

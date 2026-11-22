import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { createStyles } from '@shared/theme';
import { BottomSheet, Wheel } from '@shared/ui';

const MAX_MINUTES = 10080;
const UNITS = [
  { value: 60, key: 'reminderHours' },
  { value: 1440, key: 'reminderDays' },
  { value: 10080, key: 'reminderWeeks' },
] as const;

type ReminderPickerProps = {
  minutes: number | null;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
};

export function ReminderPicker({
  minutes,
  onClose,
  onConfirm,
}: ReminderPickerProps) {
  const { t } = useTranslation();
  const [unit, setUnit] = useState<number>(
    () =>
      [...UNITS].reverse().find(({ value }) => minutes && minutes % value === 0)
        ?.value ?? 60,
  );
  const [count, setCount] = useState(() =>
    Math.max(
      1,
      Math.min(MAX_MINUTES / unit, Math.round((minutes ?? unit) / unit)),
    ),
  );
  const numbers = Array.from({ length: MAX_MINUTES / unit }, (_, index) => ({
    label: String(index + 1),
    value: index + 1,
  }));
  const units = UNITS.map(({ value, key }) => ({
    value,
    label: t(`calendar.${key}`),
  }));

  return (
    <BottomSheet visible onClose={onClose}>
      <View style={styles.body}>
        <Text style={styles.title}>{t('calendar.reminderCustom')}</Text>
        <View style={styles.wheels}>
          <Wheel
            items={numbers}
            value={count}
            onChange={setCount}
            visibleRows={3}
            width={72}
          />
          <Wheel
            items={units}
            value={unit}
            onChange={(value) => {
              setUnit(value);
              setCount((current) => Math.min(current, MAX_MINUTES / value));
            }}
            visibleRows={3}
            width={140}
          />
        </View>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={onClose}>
            <Text style={styles.action}>{t('common.cancel')}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => onConfirm(Math.min(count * unit, MAX_MINUTES))}
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
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  action: { color: colors.childInk, padding: 12, fontWeight: '600' },
  wheels: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
}));

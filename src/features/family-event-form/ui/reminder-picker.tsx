import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { createStyles } from '@shared/theme';
import { BottomSheet, Wheel } from '@shared/ui';

const UNITS = [
  { value: 60, max: 24, key: 'reminderHours' },
  { value: 1440, max: 7, key: 'reminderDays' },
  { value: 10080, max: 2, key: 'reminderWeeks' },
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
  const [unitIndex, setUnitIndex] = useState(() =>
    UNITS.reduce(
      (selected, { value, max }, index) =>
        minutes !== null && minutes % value === 0 && minutes / value <= max
          ? index
          : selected,
      0,
    ),
  );
  const unit = UNITS[unitIndex];
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
        <Text style={styles.title}>{t('calendar.reminderCustom')}</Text>
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
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={onClose}>
            <Text style={styles.action}>{t('common.cancel')}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => onConfirm(count * unit.value)}
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
